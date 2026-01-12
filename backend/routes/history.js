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
    const apiKey = process.env.ALPHA_VANTAGE_KEY;

    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`;

    const response = await axios.get(url);
    const series = response.data["Time Series (Daily)"];

    if (!series) {
      // ⚠️ If rate-limited, serve ANY cached version for this symbol
      const fallback = Object.keys(cache).find(
        key => key.startsWith(`${symbol}_`)
      );

      if (fallback) {
        console.warn("Rate limit hit, serving stale cache:", fallback);
        return res.json(cache[fallback].data);
      }

      return res.status(429).json({
        error: "Rate limit reached",
        raw: response.data
      });
    }

    // 📈 Slice EXACT number of days requested
    const dates = Object.keys(series)
      .slice(0, NUM_DAYS)
      .reverse();

    const prices = dates.map(
      d => Number(series[d]["4. close"])
    );

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
