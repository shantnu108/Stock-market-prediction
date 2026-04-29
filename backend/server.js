const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const axios = require("axios");

// LOAD ENV FIRST
dotenv.config();

const predictRoutes = require("./routes/predict");
const historyRoutes = require("./routes/history");
const authRoutes = require("./routes/auth");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();

// --------------------
// MIDDLEWARE
// --------------------
app.use(cors());
app.use(express.json());

// --------------------
// ROUTES
// --------------------
// Auth routes (public)
app.use("/api/auth", authRoutes);

// History (public — must be before protected /api)
app.use("/api/history", historyRoutes);

// Protected routes (require JWT)
app.use("/api", authMiddleware, predictRoutes);

// --------------------
// HEALTH CHECK
// --------------------
app.get("/", (req, res) => {
  res.json({ status: "Node backend running" });
});

// --------------------
// START SERVER
// --------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Node server running on port ${PORT}`);
});

// --------------------
// MONGODB CONNECTION
// --------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err.message));
