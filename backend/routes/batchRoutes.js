// backend/routes/batchRoutes.js
import express from "express";
import db from "../db.js";
import {
  recordBatchCreated,
  recordBatchUpdated,
  verifyChain,
  getAllBlocks,
} from "../ledgerService.js";

const router = express.Router();

/**
 * Helper: map DB rows → batch objects
 */
function rowToBatch(row) {
  try {
    const parsed = JSON.parse(row.data);
    // Force id from DB
    return { ...parsed, id: row.id };
  } catch (e) {
    console.error("Error parsing batch JSON from DB:", e);
    return { id: row.id, dataCorrupted: true };
  }
}

/**
 * GET /api/batches
 * Return all batches
 */
router.get("/", (req, res) => {
  db.all(`SELECT id, data FROM batches`, [], (err, rows) => {
    if (err) {
      console.error("Error reading batches:", err);
      return res.status(500).json({ message: "Failed to read batches" });
    }
    const batches = rows.map(rowToBatch);
    res.json(batches);
  });
});

/**
 * GET /api/batches/verify-chain/status
 * Check if blockchain is valid
 */
router.get("/verify-chain/status", async (req, res) => {
  try {
    const result = await verifyChain();
    res.json(result);
  } catch (e) {
    console.error("Error verifying chain:", e);
    res.status(500).json({ message: "Failed to verify chain" });
  }
});

/**
 * GET /api/batches/blocks/all
 * Show all blocks (for debugging / demo)
 */
router.get("/blocks/all", async (req, res) => {
  try {
    const blocks = await getAllBlocks();
    res.json(blocks);
  } catch (e) {
    console.error("Error reading blocks:", e);
    res.status(500).json({ message: "Failed to read blocks" });
  }
});

/**
 * GET /api/batches/:id
 */
router.get("/:id", (req, res) => {
  const { id } = req.params;
  db.get(
    `SELECT id, data FROM batches WHERE id = ?`,
    [id],
    (err, row) => {
      if (err) {
        console.error("Error reading batch:", err);
        return res.status(500).json({ message: "Failed to read batch" });
      }
      if (!row) {
        return res.status(404).json({ message: "Batch not found" });
      }
      res.json(rowToBatch(row));
    }
  );
});

/**
 * POST /api/batches
 * Body: full batch object (with id, events, etc.)
 */
router.post("/", async (req, res) => {
  try {
    const batch = req.body;
    if (!batch || !batch.id) {
      return res.status(400).json({ message: "Batch id is required" });
    }

    const data = JSON.stringify(batch);

    db.run(
      `INSERT OR REPLACE INTO batches (id, data) VALUES (?, ?)`,
      [batch.id, data],
      async function (err) {
        if (err) {
          console.error("Error inserting batch:", err);
          return res.status(500).json({ message: "Failed to save batch" });
        }

        // Append to simple blockchain
        try {
          await recordBatchCreated(batch);
        } catch (ledgerErr) {
          console.error("Error appending block (create):", ledgerErr);
          // Don't fail the request; just log
        }

        res.status(201).json(batch);
      }
    );
  } catch (e) {
    console.error("Unexpected error in POST /api/batches:", e);
    res.status(500).json({ message: "Unexpected server error" });
  }
});

/**
 * PUT /api/batches/:id
 * Body: updated batch object
 */
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const batch = req.body;

  if (!batch || !batch.id) {
    return res.status(400).json({ message: "Batch with id is required" });
  }

  if (batch.id !== id) {
    return res
      .status(400)
      .json({ message: "URL id and body id must match" });
  }

  const data = JSON.stringify(batch);

  db.run(
    `INSERT OR REPLACE INTO batches (id, data) VALUES (?, ?)`,
    [batch.id, data],
    async function (err) {
      if (err) {
        console.error("Error updating batch:", err);
        return res.status(500).json({ message: "Failed to update batch" });
      }

      try {
        await recordBatchUpdated(batch);
      } catch (ledgerErr) {
        console.error("Error appending block (update):", ledgerErr);
      }

      res.json(batch);
    }
  );
});

export default router;
