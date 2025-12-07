// src/config.js
// For local dev: falls back to localhost:4000
export const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";
