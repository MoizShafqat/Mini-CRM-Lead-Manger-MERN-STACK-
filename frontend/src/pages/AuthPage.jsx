import { useState } from "react";
import { API } from "../api/api";
import "../styles/auth.css";
import "../styles/shared.css";

const FEATURES = [
  { icon: "📊", text: "Real-time analytics dashboard" },
  { icon: "👥", text: "Assign and track your sales team" },
  { icon: "📤", text: "Export leads to CSV instantly" },
];

export default function AuthPage({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const endpoint = isRegister ? "/auth/register" : "/auth/login";
      const body = isRegister ? form : { email: form.email, password: form.password };
      const res = await fetch(`${API}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      onLogin(data.user);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="auth-wrapper">
      {/* Left panel */}
      <div className="auth-left">
        <div className="auth-logo">
          <div className="auth-logo-icon">🎯</div>
          <span className="auth-logo-text">LeadFlow CRM</span>
        </div>

        <h1 className="auth-headline">
          Convert leads<br />into customers
        </h1>
        <p className="auth-subtext">
          Track every prospect, manage your pipeline, and close more deals — all in one place.
        </p>

        {FEATURES.map((f) => (
          <div key={f.text} className="auth-feature">
            <div className="auth-feature-icon">{f.icon}</div>
            <span className="auth-feature-text">{f.text}</span>
          </div>
        ))}
      </div>

      {/* Right panel */}
      <div className="auth-right">
        <div className="auth-form-wrap">
          <h2 className="auth-title">
            {isRegister ? "Create your account" : "Welcome back"}
          </h2>
          <p className="auth-subtitle">
            {isRegister ? "Start managing your leads today" : "Sign in to your workspace"}
          </p>

          {error && <div className="auth-error">{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            {isRegister && (
              <input
                className="inp"
                placeholder="Full Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            )}
            <input
              className="inp"
              type="email"
              placeholder="Email address"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <input
              className="inp"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            <button className="btn-primary" type="submit" disabled={loading} style={{ marginTop: 6 }}>
              {loading ? "Please wait..." : isRegister ? "Create Account" : "Sign In"}
            </button>
          </form>

          <p className="auth-switch">
            {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
            <span onClick={() => setIsRegister(!isRegister)}>
              {isRegister ? "Sign In" : "Register"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
