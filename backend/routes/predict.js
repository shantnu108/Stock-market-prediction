const express = require("express");
const axios = require("axios");
const Prediction = require("../models/Prediction");

const router = express.Router();

/**
 * POST /api/predict
 * Body: { "symbol": "AAPL" }
 */
router.post("/predict", async (req, res) => {
  const startTime = Date.now();

  try {
    const { symbol } = req.body;

    if (!symbol) {
      return res.status(400).json({ error: "symbol is required" });
    }

    // ---- CALL ML SERVICE (HANDLE COLD START) ----
    const mlResponse = await axios.post(
      `${process.env.ML_API_URL}/predict`,
      { symbol },
      {
        timeout: 60000, // 60s for Render free-tier cold start
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    const data = mlResponse.data;

    // ---- TRY SAVING TO DB (NON-BLOCKING) ----
    let saved = null;
    try {
      saved = await Prediction.create({
        symbol: data.symbol,
        prediction: data.prediction,
        confidence: data.confidence,
        regime: data.regime
      });
    } catch (dbErr) {
      console.error("DB SAVE FAILED:", dbErr.message);
    }

    // ---- SUCCESS RESPONSE ----
    return res.json({
      source: "ML Service",
      latency_ms: Date.now() - startTime,
      data,
      stored: !!saved,
      id: saved ? saved._id : null
    });

  } catch (err) {
    // ---- DETAILED ERROR LOGGING ----
    console.error("PREDICT ROUTE ERROR");

    if (err.response) {
      console.error("ML STATUS:", err.response.status);
      console.error("ML DATA:", err.response.data);
    } else if (err.request) {
      console.error("NO RESPONSE FROM ML SERVICE");
    } else {
      console.error("ERROR MESSAGE:", err.message);
    }

    return res.status(500).json({
      error: "ML service unavailable"
    });
  }
});

module.exports = router;
