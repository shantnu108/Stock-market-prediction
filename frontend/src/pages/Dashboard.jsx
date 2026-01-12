// import { useState } from "react";
// import PredictionCard from "../components/PredictionCard";
// import PriceChart from "../components/PriceChart";

// export default function Dashboard({ data, onReset }) {
//   const [tab, setTab] = useState("overview");

//   return (
//     <div
//       className="dashboard-container"
//       style={{ width: "100%", maxWidth: "1200px", margin: "0 auto" }}
//     >
//       {/* TOP CONTROLS */}
//       <div className="dashboard-controls">
//         <div className="tab-group">
//           <button
//             className={`tab-btn ${tab === "overview" ? "active" : ""}`}
//             onClick={() => setTab("overview")}
//           >
//             Overview
//           </button>

//           <button
//             className={`tab-btn ${tab === "charts" ? "active" : ""}`}
//             onClick={() => setTab("charts")}
//           >
//             Charts
//           </button>
//         </div>

//         <button className="change-btn" onClick={onReset}>
//           Change Symbol
//         </button>
//       </div>

//       {/* CONTENT */}
//       <div
//         style={{
//           marginTop: "40px",
//           display: "flex",
//           justifyContent: "center"
//         }}
//       >
//         {tab === "overview" && <PredictionCard data={data} />}
//         {tab === "charts" && <PriceChart />}
//       </div>
//     </div>
//   );
// }


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
        {/* {tab === "charts" && <PriceChart />} */}
        {tab === "charts" && <SafeChart />}

      </div>
    </div>
  );
}
