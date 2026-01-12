import SafeChart from "../components/SafeChart";
import { useState } from "react";
import PredictionCard from "../components/PredictionCard";
import PriceChart from "../components/PriceChart";

export default function Dashboard({ data, onReset }) {
  const [tab, setTab] = useState("overview");

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "20px"
      }}
    >
      {/* TOP CONTROLS */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px"
        }}
      >
        {/* Tabs */}
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            className={`tab-btn ${tab === "overview" ? "active" : ""}`}
            onClick={() => setTab("overview")}
          >
            Overview
          </button>

          <button
            className={`tab-btn ${tab === "charts" ? "active" : ""}`}
            onClick={() => setTab("charts")}
          >
            Charts
          </button>
        </div>

        {/* Reset */}
        <button className="change-btn" onClick={onReset}>
          Change Symbol
        </button>
      </div>

      {/* CONTENT */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        {tab === "overview" && <PredictionCard data={data} />}
        {tab === "charts" && <PriceChart symbol={data.symbol} />}



      </div>
    </div>
  );
}
