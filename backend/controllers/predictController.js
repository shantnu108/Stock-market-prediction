const axios = require("axios");

exports.getPrediction = async (req, res) => {
  try {
    const { symbol } = req.body;

    if (!symbol) {
      return res.status(400).json({ error: "Symbol is required" });
    }

    // Call FastAPI ML service
    const mlResponse = await axios.post(
      "http://127.0.0.1:8000/predict",
      { symbol }
    );

    const savedPrediction = await Prediction.create({
      symbol: mlResponse.data.symbol,
      prediction: mlResponse.data.prediction,
      confidence: mlResponse.data.confidence,
      regime: mlResponse.data.regime
    });

    res.json({
    source: "ML Service",
    data: mlResponse.data,
    stored: true,
    id: savedPrediction._id
    });


  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "ML service error" });
  }
};
