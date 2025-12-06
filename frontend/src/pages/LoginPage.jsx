// src/pages/LoginPage.jsx
import React, { useState } from "react";
import { useAuth } from "../AuthContext.jsx";

function LoginPage({ onSwitchToSignup }) {
  const { login, resetPassword } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      await login(email, password);
    } catch (err) {
      setMsg("Invalid credentials.");
    }
  };

  const handleReset = async () => {
    if (!email) {
      setMsg("Enter your email first.");
      return;
    }
    await resetPassword(email);
    setMsg("Reset link sent to your email.");
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>Login</h2>

        <form className="form" onSubmit={submit}>
          <label>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} />

          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {msg && <p className="auth-info">{msg}</p>}

          <button className="primary-btn">Login</button>
        </form>

        <button onClick={handleReset} className="link-btn">
          Forgot password?
        </button>

        <p>
          New user?{" "}
          <button className="link-btn" onClick={onSwitchToSignup}>
            Create account
          </button>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
