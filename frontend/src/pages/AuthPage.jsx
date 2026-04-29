import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/auth.css";

export default function AuthPage() {
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "signup") {
        if (!name.trim()) {
          setError("Name is required");
          setLoading(false);
          return;
        }
        await signup(name, email, password);
      } else {
        await login(email, password);
      }
      navigate("/", { replace: true });
    } catch (err) {
      const msg =
        err.response?.data?.error || err.message || "Something went wrong";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode(mode === "login" ? "signup" : "login");
    setError("");
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Brand */}
        <div className="auth-brand">
          <div className="auth-brand-icon">📈</div>
          <h1>StockPredictor</h1>
          <p>AI-powered market intelligence</p>
        </div>

        {/* Tab Switcher */}
        <div className="auth-tabs">
          <button
            className={`auth-tab ${mode === "login" ? "active" : ""}`}
            onClick={() => { setMode("login"); setError(""); }}
            type="button"
          >
            Sign In
          </button>
          <button
            className={`auth-tab ${mode === "signup" ? "active" : ""}`}
            onClick={() => { setMode("signup"); setError(""); }}
            type="button"
          >
            Sign Up
          </button>
        </div>

        {/* Error */}
        {error && <div className="auth-error">{error}</div>}

        {/* Form */}
        <form className="auth-form" onSubmit={handleSubmit}>
          {/* Name (signup only) */}
          {mode === "signup" && (
            <div className="auth-input-group">
              <label htmlFor="auth-name">Full Name</label>
              <input
                id="auth-name"
                className="auth-input"
                type="text"
                placeholder="---Enter the name here---"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            </div>
          )}

          {/* Email */}
          <div className="auth-input-group">
            <label htmlFor="auth-email">Email Address</label>
            <input
              id="auth-email"
              className="auth-input"
              type="email"
              placeholder="dev@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          {/* Password */}
          <div className="auth-input-group">
            <label htmlFor="auth-password">Password</label>
            <div className="auth-password-wrapper">
              <input
                id="auth-password"
                className="auth-input"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                required
                minLength={6}
              />
              <button
                type="button"
                className="auth-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading && <span className="spinner"></span>}
            {loading
              ? (mode === "login" ? "Signing in..." : "Creating account...")
              : (mode === "login" ? "Sign In" : "Create Account")
            }
          </button>
        </form>

        {/* Toggle */}
        <div className="auth-toggle">
          {mode === "login" ? "Don't have an account?" : "Already have an account?"}
          <button type="button" onClick={switchMode}>
            {mode === "login" ? "Sign Up" : "Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
}
