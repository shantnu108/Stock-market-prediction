const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const predictRoutes = require("./routes/predict");

const app = express();

// --------------------
// MIDDLEWARE
// --------------------
app.use(cors());
app.use(express.json());

// --------------------
// MONGODB CONNECTION
// --------------------
mongoose
  .connect(
    "mongodb+srv://shantnuswami1008_db_user:yybDveatgyWUV7nH@cluster0.5wvrcp3.mongodb.net/stock_predictions?retryWrites=true&w=majority"
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err.message));

// --------------------
// ROUTES
// --------------------
app.use("/api", predictRoutes);

// --------------------
// HEALTH CHECK
// --------------------
app.get("/", (req, res) => {
  res.json({ status: "Node backend running" });
});

// --------------------
// START SERVER
// --------------------gb
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Node server running on http://localhost:${PORT}`);
});
