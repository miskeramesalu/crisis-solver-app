// backend/src/routes/leaderboard.js
import express from "express";
import Leaderboard from "../models/leaderboardModel.js";
import UserBalance from "../models/userBalanceModel.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const items = await Leaderboard.find().sort({ score: -1 }).limit(20);
    res.json({ items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/userBalance/:userId", async (req, res) => {
  try {
    const record = await UserBalance.findOne({ userId: req.params.userId });
    res.json({ balance: record?.balance || 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;