import { getSignal } from "../utils/signal";

export default function PredictionCard({ data }) {
  const signal = getSignal(data);

  return (
    <div className="glass-card">
      <div
        className="signal"
        style={{
          color: signal.color,
          textShadow: `0 0 25px ${signal.color}`
        }}
      >
        {signal.label}
      </div>

      <div className="info">Symbol: {data.symbol}</div>
      <div className="info">Prediction: {data.prediction}</div>

      <div className="info" style={{ marginTop: "16px" }}>
        Confidence: {Math.round(data.confidence * 100)}%
      </div>

      <div className="conf-bar">
        <div
          className="conf-fill"
          style={{
            width: `${data.confidence * 100}%`,
            background: signal.color
          }}
        />
      </div>

      <span
        className="badge"
        style={{ background: signal.color }}
      >
        Regime {data.regime}
      </span>
      <p className="chart-disclaimer">
  The prognostications herein are derived from patterns of markets past, and shall not be construed as counsel for trade in present time.
</p>
    </div>
  );
}
