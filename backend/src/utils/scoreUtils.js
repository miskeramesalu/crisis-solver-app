// src/utils/scoreUtils.js
import mongoose, { Types } from "mongoose";
import Leaderboard from "../models/leaderboardModel.js";
import UserBalance from "../models/userBalanceModel.js";

/**
 * Safely increments user score + balance
 * @param {string} userId - Viewer account ID (string or ObjectId)
 * @param {number} points - Points to add
 */
export const updateUserScore = async (userId, points) => {
  try {
    if (!userId) {
      throw new Error("userId is required in updateUserScore()");
    }

    // Convert to ObjectId if needed
    const normalizedId = Types.ObjectId.isValid(userId)
      ? new Types.ObjectId(userId)
      : userId;

    // Update Leaderboard
    await Leaderboard.findOneAndUpdate(
      { userId: normalizedId },
      { $inc: { score: points } },
      { upsert: true, new: true }
    );

    // Update User Balance
    await UserBalance.findOneAndUpdate(
      { userId: normalizedId },
      { $inc: { balance: points } },
      { upsert: true, new: true }
    );

    console.log(`✓ Updated score: ${userId} +${points} pts`);
    return true;
  } catch (err) {
    console.error("❌ updateUserScore Error:", err.message);
    throw err; // Pass error back to route
  }
};