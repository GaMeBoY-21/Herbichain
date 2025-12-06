// backend/db.js
import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// DB file next to this file
const DB_PATH = path.join(__dirname, "herbichain.db");

const sqlite = sqlite3.verbose();

const db = new sqlite.Database(DB_PATH, (err) => {
  if (err) {
    console.error("❌ Failed to connect to SQLite:", err.message);
  } else {
    console.log(`✅ Connected to SQLite at ${DB_PATH}`);
  }
});

// Create tables
db.serialize(() => {
  // Main batches table – what batchRoutes.js expects
  db.run(
    `
    CREATE TABLE IF NOT EXISTS batches (
      id TEXT PRIMARY KEY,
      data TEXT NOT NULL,
      createdAt TEXT,
      updatedAt TEXT
    )
  `,
    (err) => {
      if (err) {
        console.error("❌ Error creating batches table:", err.message);
      } else {
        console.log("✅ batches table ready");
      }
    }
  );

  // Simple blockchain table
  db.run(
    `
    CREATE TABLE IF NOT EXISTS blocks (
      idx INTEGER PRIMARY KEY,
      hash TEXT NOT NULL,
      prevHash TEXT,
      timestamp TEXT NOT NULL,
      operation TEXT NOT NULL,
      batchId TEXT NOT NULL,
      payload TEXT NOT NULL
    )
  `,
    (err) => {
      if (err) {
        console.error("❌ Error creating blocks table:", err.message);
      } else {
        console.log("✅ blocks table ready");
      }
    }
  );
});

export default db;
