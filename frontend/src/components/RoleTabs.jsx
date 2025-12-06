// src/components/RoleTabs.jsx
import React from "react";

const roles = [
  { id: "farmer", label: "Farmer" },
  { id: "lab", label: "Lab" },
  { id: "manufacturer", label: "Manufacturer" },
  { id: "distributor", label: "Distributor" },
  { id: "regulator", label: "Regulator" },
  { id: "consumer", label: "Consumer" },
];

function RoleTabs({ activeRole, setActiveRole }) {
  return (
    <nav className="role-tabs">
      {roles.map((role) => (
        <button
          key={role.id}
          className={
            "role-tab-btn" + (activeRole === role.id ? " active" : "")
          }
          onClick={() => setActiveRole(role.id)}
        >
          {role.label}
        </button>
      ))}
    </nav>
  );
}

export default RoleTabs;
