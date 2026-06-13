import dotenv from "dotenv";
dotenv.config();
import crypto from "crypto";
import nodemailer from "nodemailer";
import express from "express";
import multer from "multer";
import cors from "cors";
import path from "path";
import fs from "fs";
import { MongoClient, ObjectId } from "mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import hederaService from "./hederaService.js";;
import axios from "axios";
import Stripe from "stripe";
import { v4 as uuidv4 } from "uuid";

/* ------------------------------------------------------------
   App Setup
------------------------------------------------------------ */
const app = express();
app.use(express.json());
app.use(cors());

/* ------------------------------------------------------------
   Ensure tmp folder for media uploads
------------------------------------------------------------ */
const tmpDir = path.join(process.cwd(), "tmp");
if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);
const upload = multer({ dest: tmpDir });

/* ------------------------------------------------------------
   MongoDB Setup
------------------------------------------------------------ */
const client = new MongoClient(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 20000,
  retryWrites: true,
});

let db;
let hedera;
let hederaReady = false;

/* ------------------------------------------------------------
   Helper: Leaderboard + Balance updates
------------------------------------------------------------ */
async function updateLeaderboard(userId, points = 1) {
  if (!userId) return;
  await db.collection("leaderboard").updateOne(
    { userId },
    {
      $inc: { score: points },
      $setOnInsert: { createdAt: new Date() },
    },
    { upsert: true }
  );
}

async function updateUserBalance(userId, amount = 0) {
  if (!userId) return;
  await db.collection("balances").updateOne(
    { userId },
    {
      $inc: { balance: amount },
      $setOnInsert: { createdAt: new Date() },
    },
    { upsert: true }
  );
}

/* ------------------------------------------------------------
   JWT Middleware (Protect routes)
------------------------------------------------------------ */
const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Not authorized, no token" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, username }
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

/* ------------------------------------------------------------
   Stripe Setup
------------------------------------------------------------ */
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/* ------------------------------------------------------------
   PayPal Helpers
------------------------------------------------------------ */
const PAYPAL_API = process.env.NODE_ENV === "production"
  ? "https://api.paypal.com"
  : "https://api.sandbox.paypal.com";

async function getPayPalAccessToken() {
  const credentials = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString("base64");
  const response = await axios.post(
    `${PAYPAL_API}/v1/oauth2/token`,
    "grant_type=client_credentials",
    {
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
  return response.data.access_token;
}

/* ------------------------------------------------------------
   Server Boot Function
------------------------------------------------------------ */
async function startServer() {
  try {
    if (!process.env.MONGO_URI) throw new Error("MONGO_URI missing in .env");
    if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET missing in .env");

    console.log("Environment variables loaded");

    // Connect MongoDB
    await client.connect();
    db = client.db(process.env.MONGO_DB_NAME || "crisisSolverDB");
    console.log("MongoDB connected");

    // Create users collection with unique indexes
    await db.collection("users").createIndex({ email: 1 }, { unique: true });
    await db.collection("users").createIndex({ username: 1 }, { unique: true });
    console.log("Users collection ready");

    // Initialize Hedera (optional)
    if (process.env.HEDERA_ACCOUNT_ID && process.env.HEDERA_PRIVATE_KEY) {
      try {
        let hedera = hederaService;
          process.env.HEDERA_ACCOUNT_ID,
          process.env.HEDERA_PRIVATE_KEY
        await hedera.createTopic();
        await hedera.createRewardToken();
        hederaReady = true;
        console.log("Hedera initialized");
      } catch (err) {
        console.warn("Hedera init failed:", err.message);
      }
    }

    /* ------------------------------------------------------------
       AUTH ROUTES (Public)
    ------------------------------------------------------------ */
    app.post("/api/auth/register", async (req, res) => {
      try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
          return res.status(400).json({ error: "All fields are required" });
        }
        const existing = await db.collection("users").findOne({
          $or: [{ email }, { username }]
        });
        if (existing) {
          return res.status(400).json({ error: "Username or email already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await db.collection("users").insertOne({
          username,
          email,
          password: hashedPassword,
          createdAt: new Date()
        });
        const token = jwt.sign(
          { id: result.insertedId.toString(), username },
          process.env.JWT_SECRET,
          { expiresIn: "7d" }
        );
        res.status(201).json({
          message: "User created",
          token,
          user: { id: result.insertedId, username, email }
        });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    app.post("/api/auth/login", async (req, res) => {
      try {
        const { email, password } = req.body;
        if (!email || !password) {
          return res.status(400).json({ error: "Email and password required" });
        }
        const user = await db.collection("users").findOne({ email });
        if (!user) return res.status(401).json({ error: "Invalid credentials" });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });
        const token = jwt.sign(
          { id: user._id.toString(), username: user.username },
          process.env.JWT_SECRET,
          { expiresIn: "7d" }
        );
        res.json({
          message: "Login successful",
          token,
          user: { id: user._id, username: user.username, email: user.email }
        });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    app.get("/api/me", protect, (req, res) => {
      res.json({ user: req.user });
    });

    /* ------------------------------------------------------------
       CORE APP ROUTES (Media, Games, Leaderboard, Donations, etc.)
    ------------------------------------------------------------ */
    app.get("/api/health", (req, res) =>
      res.json({ ok: true, hederaReady })
    );

    app.get("/api/media", async (req, res) => {
      try {
        const items = await db.collection("media").find({}).toArray();
        res.json({ items });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    app.get("/api/media/:id", async (req, res) => {
      try {
        const id = req.params.id;
        if (!ObjectId.isValid(id))
          return res.status(400).json({ error: "Invalid media ID" });
        const item = await db.collection("media").findOne({ _id: new ObjectId(id) });
        if (!item) return res.status(404).json({ error: "Media not found" });
        res.json({ item });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    app.post("/api/upload", upload.single("media"), async (req, res) => {
      try {
        const { title, description, uploaderAccountId } = req.body;
        if (!req.file) return res.status(400).json({ error: "No file uploaded" });
        const doc = {
          title,
          description,
          url: `tmp/${req.file.filename}`,
          uploaderAccountId,
          status: "pending",
          views: 0,
          createdAt: new Date(),
        };
        const result = await db.collection("media").insertOne(doc);
        await updateLeaderboard(uploaderAccountId, 5);
        await updateUserBalance(uploaderAccountId, 2);
        res.json({ ok: true, id: result.insertedId });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    app.post("/api/view", async (req, res) => {
      try {
        const { mediaId, viewerAccountId } = req.body;
        if (!ObjectId.isValid(mediaId))
          return res.status(400).json({ error: "Invalid mediaId" });
        await db.collection("media").updateOne(
          { _id: new ObjectId(mediaId) },
          { $inc: { views: 1 } }
        );
        await updateLeaderboard(viewerAccountId, 1);
        await updateUserBalance(viewerAccountId, 0.5);
        res.json({ ok: true });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    app.post("/api/answer", async (req, res) => {
      try {
        const { userId, quizId, answers } = req.body;
        await db.collection("quizAnswers").insertOne({
          userId,
          quizId,
          answers,
          createdAt: new Date(),
        });
        await updateLeaderboard(userId, 3);
        await updateUserBalance(userId, 1);
        res.json({ ok: true });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    app.post("/api/game/complete", async (req, res) => {
      try {
        const { userId, gameId, score } = req.body;
        await db.collection("games").insertOne({
          userId,
          gameId,
          score,
          createdAt: new Date(),
        });
        await updateLeaderboard(userId, score || 5);
        await updateUserBalance(userId, (score || 5) / 2);
        res.json({ ok: true });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    // Original internal donation endpoint (kept for compatibility)
    app.post("/api/donate", async (req, res) => {
      try {
        const { donorId, amount, currency } = req.body;
        await db.collection("donations").insertOne({
          donorId,
          amount,
          currency,
          createdAt: new Date(),
        });
        await updateLeaderboard(donorId, 2);
        await updateUserBalance(donorId, amount * 0.1);
        res.json({ ok: true });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    app.post("/api/referral", async (req, res) => {
      try {
        const { referrerId, newUserId } = req.body;
        await db.collection("referrals").insertOne({
          referrerId,
          newUserId,
          createdAt: new Date(),
        });
        await updateLeaderboard(referrerId, 4);
        await updateUserBalance(referrerId, 1.5);
        res.json({ ok: true });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    app.get("/api/leaderboard", async (req, res) => {
      try {
        const items = await db.collection("leaderboard")
          .find({})
          .sort({ score: -1 })
          .limit(50)
          .toArray();
        res.json({ items });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    app.get("/api/leaderboard/userBalance/:userId", async (req, res) => {
      try {
        const user = await db.collection("balances").findOne({ userId: req.params.userId });
        res.json({ balance: user?.balance || 0 });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    /* ------------------------------------------------------------
       NEW PAYMENT GATEWAY ROUTES (Stripe, PayPal, M-Pesa, Token Donations)
    ------------------------------------------------------------ */
    // Stripe: Create checkout session
    app.post("/api/create-checkout-session", async (req, res) => {
      try {
        const { amount, currency, success_url, cancel_url } = req.body;
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: [{
            price_data: {
              currency: currency || "usd",
              product_data: {
                name: "Donation to Crisis Solver",
                description: "Support verified humanitarian causes worldwide",
              },
              unit_amount: Math.round(amount * 100),
            },
            quantity: 1,
          }],
          mode: "payment",
          success_url,
          cancel_url,
          metadata: { cause: "General Crisis Fund" },
        });
        res.json({ id: session.id });
      } catch (error) {
        console.error("Stripe session error:", error);
        res.status(500).json({ error: error.message });
      }
    });

    // PayPal: Create order
    app.post("/api/paypal/create-order", async (req, res) => {
      try {
        const { amount } = req.body;
        const accessToken = await getPayPalAccessToken();
        const response = await axios.post(
          `${PAYPAL_API}/v2/checkout/orders`,
          {
            intent: "CAPTURE",
            purchase_units: [{
              amount: { currency_code: "USD", value: amount.toFixed(2) },
              description: "Donation to Crisis Solver",
            }],
          },
          { headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" } }
        );
        res.json({ id: response.data.id });
      } catch (error) {
        console.error("PayPal create order error:", error);
        res.status(500).json({ error: error.message });
      }
    });

    // PayPal: Capture order
    app.post("/api/paypal/capture-order/:orderId", async (req, res) => {
      try {
        const { orderId } = req.params;
        const accessToken = await getPayPalAccessToken();
        const response = await axios.post(
          `${PAYPAL_API}/v2/checkout/orders/${orderId}/capture`,
          {},
          { headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" } }
        );
        res.json({ status: "COMPLETED", details: response.data });
      } catch (error) {
        console.error("PayPal capture error:", error);
        res.status(500).json({ error: error.message });
      }
    });

    // M-Pesa: STK Push
    app.post("/api/mpesa/stk-push", async (req, res) => {
      try {
        const { phoneNumber, amount, accountReference, transactionDesc } = req.body;
        let formattedPhone = phoneNumber.replace(/\D/g, "");
        if (formattedPhone.startsWith("0")) formattedPhone = "254" + formattedPhone.substring(1);
        if (!formattedPhone.startsWith("254")) formattedPhone = "254" + formattedPhone;

        const auth = Buffer.from(`${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`).toString("base64");
        const tokenResponse = await axios.get(
          "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
          { headers: { Authorization: `Basic ${auth}` } }
        );
        const accessToken = tokenResponse.data.access_token;
        const timestamp = new Date().toISOString().replace(/[^0-9]/g, "").slice(0, 14);
        const password = Buffer.from(`${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`).toString("base64");
        const stkResponse = await axios.post(
          "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
          {
            BusinessShortCode: process.env.MPESA_SHORTCODE,
            Password: password,
            Timestamp: timestamp,
            TransactionType: "CustomerPayBillOnline",
            Amount: Math.round(amount),
            PartyA: formattedPhone,
            PartyB: process.env.MPESA_SHORTCODE,
            PhoneNumber: formattedPhone,
            CallBackURL: process.env.MPESA_CALLBACK_URL,
            AccountReference: accountReference || "CrisisSolver",
            TransactionDesc: transactionDesc || "Donation",
          },
          { headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" } }
        );
        res.json({ success: true, data: stkResponse.data });
      } catch (error) {
        console.error("M-Pesa STK Push error:", error);
        res.status(500).json({ success: false, error: error.message });
      }
    });

    // M-Pesa Callback (for payment confirmation)
    app.post("/api/mpesa/callback", (req, res) => {
      console.log("M-Pesa Callback received:", req.body);
      // TODO: Verify payment and update donation record in DB
      res.json({ ResultCode: 0, ResultDesc: "Success" });
    });

    // Earned Tokens Donation (uses user's internal balance)
    app.post("/api/donate-tokens", protect, async (req, res) => {
      try {
        const { amount, cause } = req.body;
        const userId = req.user.id;
        const userBalance = await db.collection("balances").findOne({ userId });
        if (!userBalance || userBalance.balance < amount) {
          return res.status(400).json({ error: "Insufficient token balance" });
        }
        // Deduct tokens
        await db.collection("balances").updateOne(
          { userId },
          { $inc: { balance: -amount } }
        );
        // Record token donation
        await db.collection("tokenDonations").insertOne({
          userId,
          amount,
          cause: cause || "General Crisis Fund",
          createdAt: new Date(),
        });
        // Optionally update leaderboard (small reward for donating)
        await updateLeaderboard(userId, amount);
        res.json({ success: true, message: `${amount} tokens donated successfully` });
      } catch (error) {
        console.error("Token donation error:", error);
        res.status(500).json({ error: error.message });
      }
    });

    /* ------------------------------------------------------------
       WAITLIST ROUTE (public)
    ------------------------------------------------------------ */
    app.post("/api/waitlist", async (req, res) => {
      try {
        const { email } = req.body;
        if (!email || !email.includes("@")) {
          return res.status(400).json({ error: "Valid email is required" });
        }

        // Check if email already exists
        const existing = await db.collection("waitlist").findOne({ email });
        if (existing) {
          return res.status(409).json({ error: "Email already registered" });
        }

        // Insert new email
        await db.collection("waitlist").insertOne({
          email,
          createdAt: new Date(),
          source: "waitlist_form",
        });

        res.status(201).json({ message: "Successfully joined waitlist" });
      } catch (error) {
        console.error("Waitlist error:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    /* ------------------------------------------------------------
       Start Server
    ------------------------------------------------------------ */
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
  } catch (err) {
    console.error("Server startup failed:", err);
    process.exit(1);
  }
}
/* =========================
   FORGOT PASSWORD
========================= */
app.post("/api/auth/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await db.collection("users").findOne({ email });

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    await db.collection("users").updateOne(
      { _id: user._id },
      {
        $set: {
          resetPasswordToken: hashedToken,
          resetPasswordExpire: Date.now() + 15 * 60 * 1000,
        },
      }
    );

    const resetUrl =
      `http://localhost:3000/reset-password?token=${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      to: user.email,
      subject: "Password Reset Request",
      html: `
        <h2>Password Reset Request</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}">
          Reset Password
        </a>
        <p>This link expires in 15 minutes.</p>
      `,
    });

    res.status(200).json({
      message: "Password reset email sent successfully",
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);

    res.status(500).json({
      error: error.message,
    });
  }
});
/* =========================
   RESET PASSWORD
========================= */
app.post("/api/auth/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        error: "Token and password are required",
      });
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await db.collection("users").findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: {
        $gt: Date.now(),
      },
    });

    if (!user) {
      return res.status(400).json({
        error: "Invalid or expired reset token",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.collection("users").updateOne(
      { _id: user._id },
      {
        $set: {
          password: hashedPassword,
        },
        $unset: {
          resetPasswordToken: "",
          resetPasswordExpire: "",
        },
      }
    );

    res.status(200).json({
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("Reset Password Error:", error);

    res.status(500).json({
      error: error.message,
    });
  }
});

startServer();