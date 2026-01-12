import { useState } from "react";

export default function Home({ onSearch, loading }) {
  const [symbol, setSymbol] = useState("AAPL");

  return (
    <div className="glass-card hero-search">
      <h1 className="hero-title">Stock Predictor</h1>

      <p className="hero-subtitle">
        AI-powered market signal & regime analysis
      </p>

      <div className="hero-search-box">
        <input
          className="hero-input"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value.toUpperCase())}
          placeholder="Enter stock symbol (AAPL, MSFT, TSLA)"
        />

        <button
          className="hero-button"
          onClick={() => onSearch(symbol)}
          disabled={loading}
        >
          {loading ? "Analyzing..." : "Predict"}
        </button>
      </div>
    </div>
  );
}
