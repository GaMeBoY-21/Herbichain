// src/App.jsx
import React, { useEffect, useState } from "react";

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
import { API_BASE } from "./config.js";          // uses VITE_API_BASE in prod
import { batchesMock } from "./data/mockData.js";

function App() {
  // -------- Auth state (Firebase) --------
  const { currentUser, role } = useAuth();       // role stored in Firestore
  const [authView, setAuthView] = useState("login"); // "login" | "signup"

  // -------- App state --------
  const [activeRole, setActiveRole] = useState(null); // UI role (locked to user role)
  const [batches, setBatches] = useState([]);
  const [selectedBatchId, setSelectedBatchId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiMessage, setApiMessage] = useState("");    // success / warning message

  // When Firebase role changes, lock activeRole to that role
  useEffect(() => {
    if (role) {
      setActiveRole(role);
    }
  }, [role]);

  // -------- Initial load: fetch batches from backend --------
  useEffect(() => {
    const loadBatches = async () => {
      try {
        setLoading(true);
        setApiMessage("");

        const res = await fetch(`${API_BASE}/api/batches`);
        if (!res.ok) {
          throw new Error(`Backend responded with ${res.status}`);
        }

        const data = await res.json();
        if (!Array.isArray(data) || data.length === 0) {
          // If DB is empty, seed UI with mock data
          setBatches(batchesMock);
          setSelectedBatchId(batchesMock[0]?.id || null);
          setApiMessage("No batches found in DB yet. Using demo batch locally.");
        } else {
          setBatches(data);
          setSelectedBatchId(data[0]?.id || null);
        }
      } catch (err) {
        console.error("Error loading batches from backend:", err);
        setBatches(batchesMock);
        setSelectedBatchId(batchesMock[0]?.id || null);
        setApiMessage(
          "Could not reach backend. Showing local demo data only."
        );
      } finally {
        setLoading(false);
      }
    };

    loadBatches();
  }, []);

  // Current selected batch object
  const selectedBatch =
    batches.find((b) => b.id === selectedBatchId) || null;

  // -------- Create batch (Farmer) --------
  const createBatch = async (newBatch) => {
    // Optimistic local update so UI always feels responsive
    setBatches((prev) => [...prev, newBatch]);
    setSelectedBatchId(newBatch.id);

    try {
      setApiMessage("");
      const res = await fetch(`${API_BASE}/api/batches`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBatch),
      });

      if (!res.ok) {
        throw new Error(`Create failed with status ${res.status}`);
      }

      const saved = await res.json();
      // Sync with server version (in case it modifies anything)
      setBatches((prev) =>
        prev.map((b) => (b.id === saved.id ? saved : b))
      );
    } catch (err) {
      console.error("Error creating batch on backend:", err);
      setApiMessage(
        "Failed to save new batch on backend. Using local state only."
      );
    }
  };

  // -------- Update batch (Lab / Manufacturer / Distributor / Regulator) --------
  const updateBatch = async (updatedBatch) => {
    // Optimistic local update
    setBatches((prev) =>
      prev.map((b) => (b.id === updatedBatch.id ? updatedBatch : b))
    );

    try {
      setApiMessage("");
      const res = await fetch(
        `${API_BASE}/api/batches/${encodeURIComponent(updatedBatch.id)}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedBatch),
        }
      );

      if (!res.ok) {
        throw new Error(`Update failed with status ${res.status}`);
      }

      const saved = await res.json();
      setBatches((prev) =>
        prev.map((b) => (b.id === saved.id ? saved : b))
      );
    } catch (err) {
      console.error("Error updating batch on backend:", err);
      setApiMessage(
        "Failed to update batch on backend. Using local state only."
      );
    }
  };

  // -------- Which page to show for the logged-in role --------
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

  // -------- Not logged in: show auth screens only --------
  if (!currentUser) {
    return (
      <div className="app auth-background">
        {authView === "login" ? (
          <LoginPage onSwitchToSignup={() => setAuthView("signup")} />
        ) : (
          <SignupPage onSwitchToLogin={() => setAuthView("login")} />
        )}
      </div>
    );
  }

  // -------- Logged-in main UI --------
  const effectiveRole = activeRole || role;

  return (
    <div className="app">
      <TopNav activeRole={effectiveRole} />

      {/* RoleTabs will show only the user’s role (farmer / lab / etc) */}
      <RoleTabs
        activeRole={effectiveRole}
        setActiveRole={setActiveRole}
        userRole={role}
      />

      {apiMessage && <p className="info-banner">{apiMessage}</p>}

      {loading ? (
        <p className="muted" style={{ padding: "12px 4px" }}>
          Loading batches…
        </p>
      ) : (
        <main className="main-content">{renderPage()}</main>
      )}
    </div>
  );
}

export default App;
