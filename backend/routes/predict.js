const express = require("express");
const axios = require("axios");
const Prediction = require("../models/Prediction");

const router = express.Router();

router.post("/predict", async (req, res) => {
  try {
    const { symbol } = req.body;

    const mlResponse = await axios.post(
      "http://127.0.0.1:8000/predict",
      { symbol }
    );

    const data = mlResponse.data;

    const saved = await Prediction.create({
      symbol: data.symbol,
      prediction: data.prediction,
      confidence: data.confidence,
      regime: data.regime
    });

    res.json({
      source: "ML Service",
      data,
      stored: true,
      id: saved._id
    });

  } catch (err) {
    console.error("PREDICT ROUTE ERROR:", err.message);
    res.status(500).json({ error: "ML service error" });
  }
});

module.exports = router;
