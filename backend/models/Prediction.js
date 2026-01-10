const mongoose = require("mongoose");

const PredictionSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true
  },
  prediction: {
    type: Number,
    required: true
  },
  confidence: {
    type: Number,
    required: true
  },
  regime: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Prediction", PredictionSchema);
