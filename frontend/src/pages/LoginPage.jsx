// src/pages/LoginPage.jsx
import React, { useState } from "react";
import { useAuth } from "../AuthContext.jsx";

function LoginPage({ onSwitchToSignup }) {
  const { login, resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setMsg("");
    try {
      await login(email, password);
    } catch (err) {
      console.error(err);
      setError("Failed to log in. Check your email or password.");
    }
  };

  const handleReset = async () => {
    if (!email) {
      setError("Enter your email above to reset password.");
      return;
    }
    setError("");
    try {
      await resetPassword(email);
      setMsg("Password reset email sent.");
    } catch (err) {
      console.error(err);
      setError("Failed to send reset email.");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>AyurTrace Login</h2>
        <p className="auth-subtitle">Sign in to access your role dashboard.</p>

        <form className="form" onSubmit={handleLogin}>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          {error && <p className="auth-error">{error}</p>}
          {msg && <p className="auth-success">{msg}</p>}

          <button type="submit" className="primary-btn">
            Log In
          </button>
        </form>

        <button className="link-btn" onClick={handleReset}>
          Forgot password? Send reset email
        </button>

        <div className="auth-footer">
          New user?{" "}
          <button className="link-btn" onClick={onSwitchToSignup}>
            Create an account
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
