
import { useEffect, useState, useRef } from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import { getHistory } from "../services/historyApi";

const TIMEFRAMES = {
  "1W": 7,
  "1M": 30,
  "3M": 90
};

export default function PriceChart({ symbol }) {
  const [rawData, setRawData] = useState(null);
  const [timeframe, setTimeframe] = useState("1M");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔒 prevents double-fetch in React 18 StrictMode
  const fetchedRef = useRef(false);
  const lastSymbolRef = useRef(null);

  useEffect(() => {
  if (!symbol) return;

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError(null);

      const days = TIMEFRAMES[timeframe];
      console.log("Requesting days:", days); // 👈 debug

      const data = await getHistory(symbol, days);
      setRawData(data);

    } catch (err) {
      console.error(err);
      setError("Failed to load market data");
    } finally {
      setLoading(false);
    }
  };

  fetchHistory();
}, [symbol, timeframe]);



  /* -------------------- STATES -------------------- */

  if (loading) {
    return (
      <div className="glass-card chart-box" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        Loading chart…
      </div>
    );
  }

  if (error || !rawData) {
    return (
      <div className="glass-card chart-box" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        {error || "No data available"}
      </div>
    );
  }

  /* -------------------- DATA -------------------- */
  console.log(
    "Total points from backend:",
    rawData.labels.length
  );

  const days = TIMEFRAMES[timeframe] || 30;

  const labels = rawData.labels.slice(-days);
  const prices = rawData.prices.slice(-days);

  const chartData = {
    labels,
    datasets: [
      {
        label: symbol,
        data: prices,
        borderColor: "#38bdf8",
        backgroundColor: "rgba(56,189,248,0.25)",
        fill: true,
        tension: 0.4,
        pointRadius: 0
      }
    ]
  };

  /* -------------------- RENDER -------------------- */

  return (
    <div className="glass-card chart-box">
      {/* TIMEFRAME SELECTOR */}
      <div className="timeframe-bar">
        {Object.keys(TIMEFRAMES).map((tf) => (
          <button
            key={tf}
            className={`tf-btn ${timeframe === tf ? "active" : ""}`}
            onClick={() => setTimeframe(tf)}
          >
            {tf}
          </button>
        ))}
      </div>

      {/* CHART */}
      <Line
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: {
              ticks: { color: "#cbd5f5" },
              grid: { color: "rgba(255,255,255,0.08)" }
            },
            y: {
              ticks: { color: "#cbd5f5" },
              grid: { color: "rgba(255,255,255,0.08)" }
            }
          }
        }}
      />
      <p className="chart-disclaimer">Real-time data is herein presented within the accompanying chart for informational and illustrative purposes only</p>
      
    </div>
  );
}
