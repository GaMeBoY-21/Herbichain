// src/App.jsx
import React, { useState, useEffect } from "react";

import TopNav from "./components/TopNav.jsx";
import RoleTabs from "./components/RoleTabs.jsx";

import FarmerPage from "./pages/FarmerPage.jsx";
import LabPage from "./pages/LabPage.jsx";
import ManufacturerPage from "./pages/ManufacturerPage.jsx";
import DistributorPage from "./pages/DistributorPage.jsx";
import RegulatorPage from "./pages/RegulatorPage.jsx";
import ConsumerPage from "./pages/ConsumerPage.jsx";

import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";

import { useAuth } from "./AuthContext.jsx";
import { batchesMock } from "./data/mockData.js";

// ⬇️ IMPORTANT: use env var, fallback to localhost for dev
const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

function App() {
  const { currentUser, role } = useAuth();
  const [authView, setAuthView] = useState("login");

  const [activeRole, setActiveRole] = useState(null);

  const [batches, setBatches] = useState([]);
  const [selectedBatchId, setSelectedBatchId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    if (role) {
      setActiveRole(role);
    }
  }, [role]);

  useEffect(() => {
    const loadBatches = async () => {
      try {
        setLoading(true);
        setApiError("");

        const res = await fetch(`${API_BASE}/api/batches`);
        if (!res.ok) throw new Error(`Backend responded with ${res.status}`);

        const data = await res.json();
        if (!Array.isArray(data) || data.length === 0) {
          setBatches(batchesMock);
          setSelectedBatchId(batchesMock[0]?.id || null);
        } else {
          setBatches(data);
          setSelectedBatchId(data[0]?.id || null);
        }
      } catch (err) {
        console.error("Error loading batches:", err);
        setApiError("Could not connect to backend. Using demo data.");
        setBatches(batchesMock);
        setSelectedBatchId(batchesMock[0]?.id || null);
      } finally {
        setLoading(false);
      }
    };

    loadBatches();
  }, []);

  const selectedBatch =
    batches.find((b) => b.id === selectedBatchId) || null;

  const createBatch = async (newBatch) => {
    try {
      setApiError("");
      const res = await fetch(`${API_BASE}/api/batches`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBatch),
      });

      if (!res.ok) throw new Error(`Create failed with ${res.status}`);

      const saved = await res.json();
      setBatches((prev) => [...prev, saved]);
      setSelectedBatchId(saved.id);
    } catch (err) {
      console.error("Error creating batch:", err);
      setApiError("Failed to create batch on backend. Using local state only.");
      setBatches((prev) => [...prev, newBatch]);
      setSelectedBatchId(newBatch.id);
    }
  };

  const updateBatch = async (updatedBatch) => {
    try {
      setApiError("");
      const res = await fetch(
        `${API_BASE}/api/batches/${encodeURIComponent(updatedBatch.id)}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedBatch),
        }
      );

      if (!res.ok) throw new Error(`Update failed with ${res.status}`);

      const saved = await res.json();
      setBatches((prev) =>
        prev.map((b) => (b.id === saved.id ? saved : b))
      );
    } catch (err) {
      console.error("Error updating batch:", err);
      setApiError("Failed to update batch on backend. Using local state only.");
      setBatches((prev) =>
        prev.map((b) => (b.id === updatedBatch.id ? updatedBatch : b))
      );
    }
  };

  const renderPage = () => {
    const commonProps = {
      batches,
      selectedBatch,
      setSelectedBatchId,
      updateBatch,
      createBatch,
    };

    const effectiveRole = activeRole || role || "farmer";

    switch (effectiveRole) {
      case "farmer":
        return <FarmerPage {...commonProps} />;
      case "lab":
        return <LabPage {...commonProps} />;
      case "manufacturer":
        return <ManufacturerPage {...commonProps} />;
      case "distributor":
        return <DistributorPage {...commonProps} />;
      case "regulator":
        return <RegulatorPage {...commonProps} />;
      case "consumer":
        return <ConsumerPage {...commonProps} />;
      default:
        return <FarmerPage {...commonProps} />;
    }
  };

  // If not logged in → show auth only
  if (!currentUser) {
    return (
      <div className="app">
        {authView === "login" ? (
          <LoginPage onSwitchToSignup={() => setAuthView("signup")} />
        ) : (
          <SignupPage onSwitchToLogin={() => setAuthView("login")} />
        )}
      </div>
    );
  }

  // Logged in view
  return (
    <div className="app">
      <TopNav activeRole={activeRole || role} />
      {/* RoleTabs already locked by userRole inside */}
      <RoleTabs
        activeRole={activeRole || role}
        setActiveRole={setActiveRole}
        userRole={role}
      />

      {apiError && <p className="error-banner">{apiError}</p>}

      {loading ? (
        <p className="muted">Loading batches...</p>
      ) : (
        <main className="main-content">{renderPage()}</main>
      )}
    </div>
  );
}

export default App;
