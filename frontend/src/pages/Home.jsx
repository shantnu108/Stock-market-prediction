import { useState } from "react";

export default function Home({ onSearch, loading }) {
  const [symbol, setSymbol] = useState("AAPL");

  return (
    <div>
      <h1>Stock Predictor</h1>

      <input
        value={symbol}
        onChange={(e) => setSymbol(e.target.value.toUpperCase())}
      />

      <br /><br />

      <button onClick={() => onSearch(symbol)} disabled={loading}>
        {loading ? "Predicting..." : "Predict"}
      </button>
    </div>
  );
}
