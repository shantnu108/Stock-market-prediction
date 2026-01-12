import { Line } from "react-chartjs-2";
import "chart.js/auto";

export default function PriceChart() {
  const data = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    datasets: [
      {
        label: "Price",
        data: [182, 179, 181, 178, 176],
        borderColor: "#38bdf8",
        backgroundColor: "rgba(56,189,248,0.25)",
        fill: true,
        tension: 0.4
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    }
  };

  return (
    <div
      className="glass-card"
      style={{ width: "900px", height: "420px" }}
    >
      <Line data={data} options={options} />
    </div>
  );
}
