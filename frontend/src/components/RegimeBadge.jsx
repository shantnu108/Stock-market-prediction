export default function RegimeBadge({ regime }) {
  const map = {
    0: { label: "Bullish Regime", color: "#22c55e" },
    1: { label: "Sideways Regime", color: "#f59e0b" },
    2: { label: "Bearish Regime", color: "#ef4444" }
  };

  const r = map[regime] || map[1];

  return (
    <span style={{
      padding: "8px 16px",
      borderRadius: "999px",
      background: r.color,
      color: "#fff",
      fontSize: "14px"
    }}>
      {r.label}
    </span>
  );
}
