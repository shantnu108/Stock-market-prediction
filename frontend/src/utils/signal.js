export function getSignal(data) {
  const { regime, confidence } = data;

  if (regime === 0 && confidence >= 0.6) {
    return { label: "BUY", color: "#00e676" };
  }

  if (regime === 2 && confidence >= 0.6) {
    return { label: "SELL", color: "#ff1744" };
  }

  return { label: "HOLD", color: "#ffca28" };
}
