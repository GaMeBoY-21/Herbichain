// src/components/TopNav.jsx
import React from "react";
import { useAuth } from "../AuthContext.jsx";

function TopNav({ role }) {
  const { logout, currentUser } = useAuth();

  return (
    <header className="topnav">
      <div>
        <h2>HerbiChain</h2>
        <p className="muted small">Role: {role}</p>
      </div>

      <div>
        <span className="muted small">{currentUser?.email}</span>
        <button className="secondary-btn" onClick={logout}>
          Logout
        </button>
      </div>
    </header>
  );
}

export default TopNav;
