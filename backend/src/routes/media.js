// backend/src/routes/media.js
import express from "express";
import { ObjectId } from "mongodb";
import { updateUserScore } from "../utils/scoreUtils.js";

const router = express.Router();

/**
 * GET /api/media
 * Fetch all media items
 */
router.get("/", async (req, res) => {
  try {
    const db = req.app.locals.db;
    if (!db) {
      return res.status(500).json({ error: "Database not initialized" });
    }

    const items = await db.collection("media").find({}).toArray();
    res.json({ items });
  } catch (err) {
    console.error("GET /api/media error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/media/view
 * Increment media view count + reward viewer
 */
router.post("/view", async (req, res) => {
  const { viewerAccountId, mediaId } = req.body;

  // Validate input
  if (!viewerAccountId || !mediaId) {
    return res
      .status(400)
      .json({ error: "viewerAccountId and mediaId are required" });
  }

  try {
    const db = req.app.locals.db;
    if (!db) {
      return res.status(500).json({ error: "Database not initialized" });
    }

    // Validate ObjectId
    if (!ObjectId.isValid(mediaId)) {
      return res.status(400).json({ error: "Invalid mediaId format" });
    }

    const mediaObjectId = new ObjectId(mediaId);

    // Increment view count atomically
    const updateResult = await db
      .collection("media")
      .updateOne({ _id: mediaObjectId }, { $inc: { views: 1 } });

    if (updateResult.matchedCount === 0) {
      return res.status(404).json({ error: "Media item not found" });
    }

    // Reward user with points (5 points)
    await updateUserScore(viewerAccountId, 5);

    res.json({
      message: "Media viewed successfully",
      pointsAwarded: 5,
    });
  } catch (err) {
    console.error("POST /api/media/view error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;