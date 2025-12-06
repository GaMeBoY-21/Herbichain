// src/pages/SignupPage.jsx
import React, { useState } from "react";
import { useAuth } from "../AuthContext.jsx";

const roles = [
  { id: "farmer", label: "Farmer" },
  { id: "lab", label: "Lab" },
  { id: "manufacturer", label: "Manufacturer" },
  { id: "distributor", label: "Distributor" },
  { id: "regulator", label: "Regulator" },
  { id: "consumer", label: "Consumer" },
];

function SignupPage({ onSwitchToLogin }) {
  const { signup } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("farmer");
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signup(email, password, role);
    } catch (err) {
      console.error(err);
      setError("Failed to create account. Try different email.");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>Create Account</h2>
        <p className="auth-subtitle">
          Sign up and choose your role in the Ayurvedic supply chain.
        </p>

        <form className="form" onSubmit={handleSignup}>
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

          <label>
            Select Role
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.label}
                </option>
              ))}
            </select>
          </label>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="primary-btn">
            Sign Up
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?{" "}
          <button className="link-btn" onClick={onSwitchToLogin}>
            Log in
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
