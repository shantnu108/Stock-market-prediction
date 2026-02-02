
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
    // Check if we have cached data but with a rate limit message
    if (rawData?._cached) {
      // Continue rendering with the cached data but show a warning
      return (
        <div className="glass-card chart-box">
          <div style={{ 
            backgroundColor: 'rgba(234, 179, 8, 0.2)',
            padding: '10px',
            borderRadius: '4px',
            marginBottom: '10px',
            borderLeft: '4px solid #eab308'
          }}>
            <p style={{ color: '#eab308', margin: '0' }}>⚠️ {rawData._message || 'Using cached data'}</p>
            <p style={{ color: '#9ca3af', fontSize: '0.9em', margin: '5px 0 0 0' }}>
              API rate limit reached. Data may be outdated.
            </p>
          </div>
          {renderChart()}
        </div>
      );
    }

    // If we have a rate limit error from the API
    if (error?.includes('rate limit')) {
      return (
        <div className="glass-card chart-box" style={{ padding: '20px' }}>
          <div style={{ 
            color: '#f59e0b', 
            marginBottom: '15px',
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            padding: '15px',
            borderRadius: '8px',
            borderLeft: '4px solid #f59e0b'
          }}>
            <h3 style={{ marginTop: '0', color: '#f59e0b' }}>API Rate Limit Reached</h3>
            <p>You've exceeded the free tier limit of 25 requests per day to Alpha Vantage API.</p>
            <p>Options:</p>
            <ul style={{ marginLeft: '20px', paddingLeft: '0' }}>
              <li>• Wait until midnight UTC for the limit to reset</li>
              <li>• Use a different Alpha Vantage API key</li>
              <li>• Upgrade to a premium plan at <a href="https://www.alphavantage.co/premium/" target="_blank" rel="noopener noreferrer" style={{ color: '#60a5fa' }}>Alpha Vantage Premium</a></li>
            </ul>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            style={{
              marginTop: '10px',
              padding: '8px 16px',
              background: '#f59e0b',
              border: 'none',
              borderRadius: '4px',
              color: 'white',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            Try Again
          </button>
        </div>
      );
    }

    // Default error state
    return (
      <div className="glass-card chart-box" style={{ padding: '20px' }}>
        <div style={{ 
          color: '#ef4444', 
          marginBottom: '15px',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          padding: '15px',
          borderRadius: '8px',
          borderLeft: '4px solid #ef4444'
        }}>
          <h3 style={{ marginTop: '0', color: '#ef4444' }}>Failed to load market data</h3>
          <p>Possible causes:</p>
          <ul style={{ marginLeft: '20px', paddingLeft: '0' }}>
            <li>• {error || 'Unknown error occurred'}</li>
            <li>• Alpha Vantage API key is missing or invalid</li>
            <li>• Network connectivity issue</li>
            <li>• Invalid stock symbol: {symbol}</li>
          </ul>
        </div>
        <button 
          onClick={() => window.location.reload()} 
          style={{
            marginTop: '10px',
            padding: '8px 16px',
            background: '#38bdf8',
            border: 'none',
            borderRadius: '4px',
            color: 'white',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          Retry
        </button>
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
