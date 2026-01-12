import { useEffect, useState } from "react";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import { getPrediction } from "./services/api";
import "./styles/theme.css";

export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔒 FORCE DARK MODE
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "dark");
  }, []);

  const fetchPrediction = async (symbol) => {
    try {
      setLoading(true);
      const result = await getPrediction(symbol);
      setData(result);
    } catch (e) {
      alert("Backend error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-root">
      <a
        href="https://github.com/shantnu108"
        target="_blank"
        rel="noopener noreferrer"
        className="github-link"
      >
        &lt;/DEV&gt;
      </a>

      {!data ? (
        <Home onSearch={fetchPrediction} loading={loading} />
      ) : (
        <Dashboard data={data} onReset={() => setData(null)} />
      )}
    </div>
  );
}
