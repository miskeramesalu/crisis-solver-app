// backend/src/utils/server.js
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import multer from "multer";
import cors from "cors";
import path from "path";
import fs from "fs";
import { MongoClient, ObjectId } from "mongodb";
import { HederaService } from "./hederaService.js";

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
   Server Boot Function
------------------------------------------------------------ */
async function startServer() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI missing in .env");
    }

    console.log("Environment variables loaded");

    // Connect MongoDB
    await client.connect();
    db = client.db(process.env.MONGO_DB_NAME || "crisisSolverDB");
    console.log("MongoDB connected");

    // Initialize Hedera (optional)
    if (process.env.HEDERA_ACCOUNT_ID && process.env.HEDERA_PRIVATE_KEY) {
      try {
        hedera = new HederaService(
          process.env.HEDERA_ACCOUNT_ID,
          process.env.HEDERA_PRIVATE_KEY
        );
        await hedera.createTopic();
        await hedera.createRewardToken();
        hederaReady = true;
        console.log("Hedera initialized");
      } catch (err) {
        console.warn("Hedera init failed:", err.message);
      }
    }

    /* ------------------------------------------------------------
       Health Check
    ------------------------------------------------------------ */
    app.get("/api/health", (req, res) =>
      res.json({ ok: true, hederaReady })
    );

    /* ------------------------------------------------------------
       Media List (Required by Frontend)
    ------------------------------------------------------------ */
    app.get("/api/media", async (req, res) => {
      try {
        const items = await db.collection("media").find({}).toArray();
        res.json({ items });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    /* ------------------------------------------------------------
       Get a Single Media Item
    ------------------------------------------------------------ */
    app.get("/api/media/:id", async (req, res) => {
      try {
        const id = req.params.id;
        if (!ObjectId.isValid(id))
          return res.status(400).json({ error: "Invalid media ID" });

        const item = await db
          .collection("media")
          .findOne({ _id: new ObjectId(id) });

        if (!item) return res.status(404).json({ error: "Media not found" });

        res.json({ item });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    /* ------------------------------------------------------------
       Media Upload
    ------------------------------------------------------------ */
    app.post("/api/upload", upload.single("media"), async (req, res) => {
      try {
        const { title, description, uploaderAccountId } = req.body;
        if (!req.file)
          return res.status(400).json({ error: "No file uploaded" });

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

    /* ------------------------------------------------------------
       Media View + Reward
    ------------------------------------------------------------ */
    app.post("/api/view", async (req, res) => {
      try {
        const { mediaId, viewerAccountId } = req.body;

        if (!ObjectId.isValid(mediaId))
          return res.status(400).json({ error: "Invalid mediaId" });

        await db
          .collection("media")
          .updateOne({ _id: new ObjectId(mediaId) }, { $inc: { views: 1 } });

        await updateLeaderboard(viewerAccountId, 1);
        await updateUserBalance(viewerAccountId, 0.5);

        res.json({ ok: true });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    /* ------------------------------------------------------------
       Quiz
    ------------------------------------------------------------ */
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

    /* ------------------------------------------------------------
       Game Completion
    ------------------------------------------------------------ */
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

    /* ------------------------------------------------------------
       Donation
    ------------------------------------------------------------ */
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

    /* ------------------------------------------------------------
       Referral
    ------------------------------------------------------------ */
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

    /* ------------------------------------------------------------
       Leaderboard APIs
    ------------------------------------------------------------ */
    app.get("/api/leaderboard", async (req, res) => {
      try {
        const items = await db
          .collection("leaderboard")
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
        const user = await db
          .collection("balances")
          .findOne({ userId: req.params.userId });

        res.json({ balance: user?.balance || 0 });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    /* ------------------------------------------------------------
       Start Server
    ------------------------------------------------------------ */
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () =>
      console.log(`Backend running on port ${PORT}`)
    );
  } catch (err) {
    console.error("Server startup failed:", err);
    process.exit(1);
  }
}

startServer();