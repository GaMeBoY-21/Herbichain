// src/components/RoleTabs.jsx
import React from "react";

const allRoles = [
  { id: "farmer", label: "Farmer" },
  { id: "lab", label: "Lab" },
  { id: "manufacturer", label: "Manufacturer" },
  { id: "distributor", label: "Distributor" },
  { id: "regulator", label: "Regulator" },
  { id: "consumer", label: "Consumer" },
];

function RoleTabs({ activeRole, setActiveRole, userRole }) {
  const rolesToShow = allRoles.filter((r) => r.id === userRole);

  return (
    <nav className="role-tabs">
      {rolesToShow.map((r) => (
        <button
          key={r.id}
          className={
            "role-tab-btn" + (activeRole === r.id ? " active" : "")
          }
          onClick={() => setActiveRole(r.id)}
        >
          {r.label}
        </button>
      ))}
    </nav>
  );
}

export default RoleTabs;
