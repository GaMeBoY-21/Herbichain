// src/config.js

// Base URL for your backend API.
// In production, Vercel will inject VITE_API_BASE from environment variables.
// Locally it will fall back to http://localhost:4000.
export const API_BASE =
  import.meta.env.VITE_API_BASE || "http://localhost:4000";
