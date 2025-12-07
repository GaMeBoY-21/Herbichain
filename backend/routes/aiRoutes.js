// backend/routes/aiRoutes.js
import express from "express";
import { generateTimelineSummary } from "../aiService.js";

const router = express.Router();

/**
 * POST /api/ai/timeline
 * Body: { batch: { ...full batch object... } }
 */
router.post("/timeline", async (req, res) => {
  try {
    const { batch } = req.body;

    if (!batch) {
      return res.status(400).json({
        message: "Batch data is required to generate AI summary",
      });
    }

    const summary = await generateTimelineSummary(batch);

    res.json({
      ok: true,
      batchId: batch.id,
      summary,
    });
  } catch (error) {
    console.error("Error generating AI timeline:", error);
    res.status(500).json({
      ok: false,
      message: "AI service failed to generate summary",
    });
  }
});

export default router;
