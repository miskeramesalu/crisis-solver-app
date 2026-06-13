import nodemailer from "nodemailer";
import config from "../config.js";

// DEBUG (temporary - remove after fix)
console.log("EMAIL DEBUG");
console.log("USER:", config.email.user);
console.log("PASS LENGTH:", config.email.pass?.length);
console.log("PASS RAW:", JSON.stringify(config.email.pass));

const transporter = nodemailer.createTransport({
  host: config.email.host || "smtp.gmail.com",
  port: Number(config.email.port) || 587,
  secure: false, // STARTTLS
  auth: {
    user: (config.email.user || "").trim(),
    pass: (config.email.pass || "").trim(),
  },
});

// SMTP CHECK
transporter.verify((error) => {
  if (error) {
    console.error("❌ SMTP FAILED:");
    console.error(error);
  } else {
    console.log("✅ SMTP READY");
  }
});

export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const info = await transporter.sendMail({
      from: `"Crisis Solver" <${config.email.user}>`,
      to,
      subject,
      text,
      html,
    });

    console.log("✅ EMAIL SENT:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ EMAIL ERROR:");
    console.error(error.code);
    console.error(error.response);
    throw error;
  }
};