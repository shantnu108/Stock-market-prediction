import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import AuthPage from "./pages/AuthPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import { getPrediction } from "./services/api";
import "./styles/theme.css";
import "./styles/auth.css";

export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user, logout } = useAuth();

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
      {/* User Header — only shown when logged in */}
      {user && (
        <div className="user-header">
          <div className="user-info">
            <div className="user-avatar">
              {user.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div>
              <div className="user-name">{user.name}</div>
              <div className="user-email">{user.email}</div>
            </div>
          </div>
          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      )}

      <a
        href="https://github.com/shantnu108"
        target="_blank"
        rel="noopener noreferrer"
        className="github-link"
        style={user ? { top: "60px" } : {}}
      >
        &lt;/DEV&gt;
      </a>

      <Routes>
        <Route path="/login" element={
          user ? <Navigate to="/" replace /> : <AuthPage />
        } />
        <Route path="/" element={
          <ProtectedRoute>
            {!data ? (
              <Home onSearch={fetchPrediction} loading={loading} />
            ) : (
              <Dashboard data={data} onReset={() => setData(null)} />
            )}
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
