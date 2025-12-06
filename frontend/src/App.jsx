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

const API_BASE = "http://localhost:4000";

function App() {
  const { currentUser, role } = useAuth();
  const [authView, setAuthView] = useState("login");

  const [activeRole, setActiveRole] = useState(null);

  const [batches, setBatches] = useState([]);
  const [selectedBatchId, setSelectedBatchId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    if (role) setActiveRole(role);
  }, [role]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/batches`);
        if (!res.ok) throw new Error("Backend error");

        const data = await res.json();
        if (!data.length) {
          setBatches(batchesMock);
          setSelectedBatchId(batchesMock[0].id);
        } else {
          setBatches(data);
          setSelectedBatchId(data[0].id);
        }
      } catch (err) {
        setBatches(batchesMock);
        setSelectedBatchId(batchesMock[0].id);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const selectedBatch = batches.find((b) => b.id === selectedBatchId);

  const createBatch = async (batch) => {
    try {
      const res = await fetch(`${API_BASE}/api/batches`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(batch),
      });
      const saved = await res.json();
      setBatches((prev) => [...prev, saved]);
      setSelectedBatchId(saved.id);
    } catch {
      setBatches((prev) => [...prev, batch]);
      setSelectedBatchId(batch.id);
    }
  };

  const updateBatch = async (updated) => {
    try {
      const res = await fetch(`${API_BASE}/api/batches/${updated.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });

      const saved = await res.json();
      setBatches((prev) =>
        prev.map((b) => (b.id === saved.id ? saved : b))
      );
    } catch {
      setBatches((prev) =>
        prev.map((b) => (b.id === updated.id ? updated : b))
      );
    }
  };

  const renderPage = () => {
    const props = {
      batches,
      selectedBatch,
      setSelectedBatchId,
      createBatch,
      updateBatch,
    };

    switch (activeRole) {
      case "farmer":
        return <FarmerPage {...props} />;
      case "lab":
        return <LabPage {...props} />;
      case "manufacturer":
        return <ManufacturerPage {...props} />;
      case "distributor":
        return <DistributorPage {...props} />;
      case "regulator":
        return <RegulatorPage {...props} />;
      case "consumer":
        return <ConsumerPage {...props} />;
      default:
        return null;
    }
  };

  if (!currentUser) {
    return authView === "login" ? (
      <LoginPage onSwitchToSignup={() => setAuthView("signup")} />
    ) : (
      <SignupPage onSwitchToLogin={() => setAuthView("login")} />
    );
  }

  return (
    <div className="app">
      <TopNav role={role} />

      <RoleTabs
        activeRole={activeRole}
        setActiveRole={setActiveRole}
        userRole={role}
      />

      {apiError && <p className="error-banner">{apiError}</p>}

      {loading ? (
        <p className="muted">Loading...</p>
      ) : (
        <main className="main-content">{renderPage()}</main>
      )}
    </div>
  );
}

export default App;
