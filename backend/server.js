import express from "express";
import cors from "cors";
import batchRoutes from "./routes/batchRoutes.js";

const app = express();

// Render will inject FRONTEND_ORIGIN
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";

app.use(
  cors({
    origin: FRONTEND_ORIGIN,
  })
);

app.use(express.json());

// API endpoints
app.use("/api/batches", batchRoutes);

app.get("/", (req, res) => {
  res.send("Herbichain Backend Running");
});

// Render requires dynamic port
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
