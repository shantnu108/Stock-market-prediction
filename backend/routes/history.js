const express = require("express");
const axios = require("axios");

const router = express.Router();

// 🔥 IN-MEMORY CACHE
// key format: SYMBOL_DAYS (e.g. AAPL_30)
const cache = {};
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

router.get("/", async (req, res) => {
  const { symbol, days } = req.query;

  if (!symbol) {
    return res.status(400).json({ error: "Symbol required" });
  }

  const NUM_DAYS = Number(days) || 30;
  const cacheKey = `${symbol}_${NUM_DAYS}`;
  const now = Date.now();

  // ✅ SERVE FROM CACHE (PER SYMBOL + TIMEFRAME)
  if (
    cache[cacheKey] &&
    now - cache[cacheKey].timestamp < CACHE_TTL
  ) {
    console.log("Serving history from cache:", cacheKey);
    return res.json(cache[cacheKey].data);
  }

  try {
    // Yahoo Finance API - no API key required!
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?period1=${Math.floor((Date.now() - NUM_DAYS * 24 * 60 * 60 * 1000) / 1000)}&period2=${Math.floor(Date.now() / 1000)}&interval=1d`;

    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const chart = response.data.chart;
    if (!chart || !chart.result || chart.result.length === 0) {
      return res.status(404).json({ error: "Symbol not found" });
    }

    const result = chart.result[0];
    const timestamps = result.timestamp;
    const quotes = result.indicators.quote[0];

    if (!timestamps || !quotes || !quotes.close) {
      return res.status(404).json({ error: "No data available for this symbol" });
    }

    // Convert timestamps to dates and get close prices
    const dates = timestamps.map(ts => {
      const date = new Date(ts * 1000);
      return date.toISOString().split('T')[0];
    });

    const prices = quotes.close.filter(price => price !== null);

    const payload = {
      symbol,
      labels: dates,
      prices
    };

    // 🧠 STORE IN CACHE
    cache[cacheKey] = {
      timestamp: now,
      data: payload
    };

    res.json(payload);

  } catch (err) {
    console.error("History API error:", err.message);
    res.status(500).json({ error: "Market API failed" });
  }
});

module.exports = router;
