import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";

sqlite3.verbose();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database stored in backend folder
const DB_PATH = path.join(__dirname, "herbichain.db");

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error("❌ Error connecting to SQLite:", err.message);
  } else {
    console.log("✅ Connected to SQLite at", DB_PATH);

    db.run(
      `
      CREATE TABLE IF NOT EXISTS batches (
        id TEXT PRIMARY KEY,
        data TEXT NOT NULL
      )
    `,
      () => console.log("👍 batches table ready")
    );

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
      () => console.log("👍 blocks table ready")
    );
  }
});

export default db;
