import PriceChart from "./PriceChart";

export default function SafeChart() {
  try {
    return <PriceChart />;
  } catch (e) {
    console.error("Chart crashed:", e);
    return (
      <div className="glass-card" style={{ padding: "40px" }}>
        <h3>Chart failed to load</h3>
        <p style={{ opacity: 0.7 }}>
          Check console for details.
        </p>
      </div>
    );
  }
}
