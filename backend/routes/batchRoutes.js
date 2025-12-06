import express from "express";
import { v4 as uuidv4 } from "uuid";
import {
  createBatch,
  addEvent,
  getBatch,
  getAllBatches,
  clearLedger,
} from "../ledger.js";

const router = express.Router();

// GET all batches
router.get("/", (req, res) => {
  res.json(getAllBatches());
});

// GET batch by ID
router.get("/:id", (req, res) => {
  const batch = getBatch(req.params.id);
  if (!batch) return res.status(404).json({ error: "Batch not found" });
  res.json(batch);
});

// POST create batch
router.post("/", (req, res) => {
  const {
    herbName,
    species,
    farmerName,
    locationName,
    coordinates,
  } = req.body;

  const id = "BATCH-" + String(Date.now()).slice(-6);

  const firstEvent = {
    id: uuidv4(),
    type: "HARVEST",
    by: "Farmer",
    actorName: farmerName,
    timestamp: new Date().toISOString(),
    details: `Harvested ${herbName}.`,
    locationName,
    coordinates,
  };

  const batchObj = {
    id,
    herbName,
    species,
    farmerName,
    locationName,
    coordinates,
    status: "Harvested",
    qrCodeValue: id,
    events: [firstEvent],
  };

  const saved = createBatch(batchObj);
  res.status(201).json(saved);
});

// POST add event
router.post("/:id/events", (req, res) => {
  const batchId = req.params.id;
  const {
    type,
    by,
    actorName,
    details,
    locationName,
    coordinates,
    extra,
  } = req.body;

  const event = {
    id: uuidv4(),
    type,
    by,
    actorName,
    timestamp: new Date().toISOString(),
    details,
    locationName,
    coordinates,
    ...(extra || {}),
  };

  const updatedBatch = addEvent(batchId, event);

  if (!updatedBatch)
    return res.status(404).json({ error: "Batch not found" });

  res.json(updatedBatch);
});

// DELETE clear ledger (optional)
router.delete("/clear", (req, res) => {
  clearLedger();
  res.json({ message: "Ledger cleared" });
});

export default router;
