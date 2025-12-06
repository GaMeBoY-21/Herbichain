// backend/ledgerService.js
import crypto from "crypto";
import db from "./db.js";

/**
 * Calculate a SHA-256 hash for a block
 */
function calculateHash(idx, prevHash, timestamp, operation, batchId, payload) {
  const raw = `${idx}|${prevHash || ""}|${timestamp}|${operation}|${batchId}|${payload}`;
  return crypto.createHash("sha256").update(raw).digest("hex");
}

/**
 * Get the last block in the chain (highest idx)
 */
function getLastBlock() {
  return new Promise((resolve, reject) => {
    db.get(
      `
      SELECT idx, hash, prevHash, timestamp, operation, batchId, payload
      FROM blocks
      ORDER BY idx DESC
      LIMIT 1
    `,
      [],
      (err, row) => {
        if (err) return reject(err);
        resolve(row || null);
      }
    );
  });
}

/**
 * Append a new block for a given operation + batch payload
 */
async function appendBlock(operation, batchId, payloadObject) {
  const lastBlock = await getLastBlock();
  const prevHash = lastBlock ? lastBlock.hash : null;
  const nextIdx = lastBlock ? lastBlock.idx + 1 : 1;
  const timestamp = new Date().toISOString();
  const payload = JSON.stringify(payloadObject);

  const hash = calculateHash(
    nextIdx,
    prevHash,
    timestamp,
    operation,
    batchId,
    payload
  );

  return new Promise((resolve, reject) => {
    db.run(
      `
      INSERT INTO blocks (idx, hash, prevHash, timestamp, operation, batchId, payload)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
      [nextIdx, hash, prevHash, timestamp, operation, batchId, payload],
      function (err) {
        if (err) return reject(err);
        resolve({
          idx: nextIdx,
          hash,
          prevHash,
          timestamp,
          operation,
          batchId,
          payload,
        });
      }
    );
  });
}

/**
 * Public: record that a batch was created
 */
export async function recordBatchCreated(batch) {
  if (!batch || !batch.id) return;
  await appendBlock("BATCH_CREATED", batch.id, batch);
}

/**
 * Public: record that a batch was updated
 */
export async function recordBatchUpdated(batch) {
  if (!batch || !batch.id) return;
  await appendBlock("BATCH_UPDATED", batch.id, batch);
}

/**
 * Verify the entire chain is consistent:
 *  - hashes intact
 *  - prevHash links are correct
 */
export function verifyChain() {
  return new Promise((resolve, reject) => {
    db.all(
      `
      SELECT idx, hash, prevHash, timestamp, operation, batchId, payload
      FROM blocks
      ORDER BY idx ASC
    `,
      [],
      (err, rows) => {
        if (err) return reject(err);

        for (let i = 0; i < rows.length; i++) {
          const block = rows[i];
          const expectedPrevHash = i === 0 ? null : rows[i - 1].hash;

          if (block.prevHash !== expectedPrevHash) {
            return resolve({
              valid: false,
              error: `Block ${block.idx} has wrong prevHash`,
            });
          }

          const recalculated = calculateHash(
            block.idx,
            block.prevHash,
            block.timestamp,
            block.operation,
            block.batchId,
            block.payload
          );

          if (block.hash !== recalculated) {
            return resolve({
              valid: false,
              error: `Block ${block.idx} hash mismatch`,
            });
          }
        }

        return resolve({
          valid: true,
          length: rows.length,
        });
      }
    );
  });
}

/**
 * Optional: expose all blocks – useful for debugging / demo
 */
export function getAllBlocks() {
  return new Promise((resolve, reject) => {
    db.all(
      `
      SELECT idx, hash, prevHash, timestamp, operation, batchId, payload
      FROM blocks
      ORDER BY idx ASC
    `,
      [],
      (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      }
    );
  });
}
