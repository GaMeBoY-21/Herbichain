import express from "express";
import cors from "cors";
import batchRoutes from "./routes/batchRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/batches", batchRoutes);

app.get("/", (req, res) => {
  res.send("Herbichain Backend Running");
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
