// src/pages/SignupPage.jsx
import React, { useState } from "react";
import { useAuth } from "../AuthContext.jsx";

const roles = [
  "farmer",
  "lab",
  "manufacturer",
  "distributor",
  "regulator",
  "consumer",
];

function SignupPage({ onSwitchToLogin }) {
  const { signup } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("farmer");
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      await signup(email, password, role);
    } catch {
      setMsg("Signup failed. Email may already exist.");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>Create Account</h2>

        <form className="form" onSubmit={submit}>
          <label>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} />

          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <label>Select Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            {roles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>

          {msg && <p className="auth-error">{msg}</p>}

          <button className="primary-btn">Sign Up</button>
        </form>

        <p>
          Already registered?{" "}
          <button className="link-btn" onClick={onSwitchToLogin}>
            Log in
          </button>
        </p>
      </div>
    </div>
  );
}

export default SignupPage;
