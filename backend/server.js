const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const axios = require("axios");

// LOAD ENV FIRST
dotenv.config();

const predictRoutes = require("./routes/predict"); // FIXED NAME
const historyRoutes = require("./routes/history");

const app = express();

// --------------------
// MIDDLEWARE
// --------------------
app.use(cors());
app.use(express.json());

// --------------------
// ROUTES
// --------------------
app.use("/api", predictRoutes);
app.use("/api/history", historyRoutes);

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
