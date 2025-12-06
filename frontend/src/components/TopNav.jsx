// src/components/TopNav.jsx
import React from "react";
import { useAuth } from "../AuthContext.jsx";

const roleLabels = {
  farmer: "Farmer",
  lab: "Lab",
  manufacturer: "Manufacturer",
  distributor: "Distributor",
  regulator: "Regulator",
  consumer: "Consumer",
};

function TopNav() {
  const { currentUser, role, logout } = useAuth();

  return (
    <header className="topnav">
      <div className="topnav-left">
        <span className="logo-dot" />
        <h1>AyurTrace – Traceability Demo</h1>
      </div>

      {currentUser && (
        <div className="topnav-right">
          <div className="user-info">
            <span className="badge">
              Role: {roleLabels[role] || "Unknown"}
            </span>
            <span className="user-email">{currentUser.email}</span>
          </div>
          <button className="secondary-btn" onClick={logout}>
            Logout
          </button>
        </div>
      )}
    </header>
  );
}

export default TopNav;
