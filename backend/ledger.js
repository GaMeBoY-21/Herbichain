import crypto from "crypto";

let batches = []; // In-memory ledger

// Generate SHA256 hash
function hashData(data) {
  return crypto.createHash("sha256").update(JSON.stringify(data)).digest("hex");
}

// Create new batch
export function createBatch(batch) {
  const block = {
    ...batch,
    chainHash: hashData(batch.events), // Blockchain-style immutability
  };

  batches.push(block);
  return block;
}

// Add event to a batch
export function addEvent(batchId, event) {
  const batch = batches.find((b) => b.id === batchId);
  if (!batch) return null;

  batch.events.push(event);

  // Recompute block hash
  batch.chainHash = hashData(batch.events);

  return batch;
}

export function getBatch(batchId) {
  return batches.find((b) => b.id === batchId) || null;
}

export function getAllBatches() {
  return batches;
}

export function clearLedger() {
  batches = [];
}
