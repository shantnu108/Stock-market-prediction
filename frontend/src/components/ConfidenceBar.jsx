export default function ConfidenceBar({ value }) {
  const percent = Math.round(value * 100);

  return (
    <div style={{ marginTop: "16px" }}>
      <small>Confidence: {percent}%</small>

      <div style={{
        marginTop: "6px",
        height: "10px",
        width: "100%",
        background: "rgba(255,255,255,0.3)",
        borderRadius: "20px",
        overflow: "hidden"
      }}>
        <div style={{
          height: "100%",
          width: `${percent}%`,
          background: "linear-gradient(90deg,#00e676,#1de9b6)",
          transition: "width 0.8s ease"
        }} />
      </div>
    </div>
  );
}
