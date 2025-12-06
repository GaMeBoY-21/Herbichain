// src/App.jsx
import React, { useState } from "react";
import TopNav from "./components/TopNav.jsx";
// import RoleTabs from "./components/RoleTabs.jsx"; // NOT needed now

import FarmerPage from "./pages/FarmerPage.jsx";
import LabPage from "./pages/LabPage.jsx";
import ManufacturerPage from "./pages/ManufacturerPage.jsx";
import DistributorPage from "./pages/DistributorPage.jsx";
import RegulatorPage from "./pages/RegulatorPage.jsx";
import ConsumerPage from "./pages/ConsumerPage.jsx";

import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";

import { batchesMock } from "./data/mockData.js";
import { useAuth } from "./AuthContext.jsx";

function App() {
  const { currentUser, role } = useAuth();

  const [batches, setBatches] = useState(batchesMock);
  const [selectedBatchId, setSelectedBatchId] = useState(
    batchesMock[0]?.id || null
  );

  const [showSignup, setShowSignup] = useState(false);

  const selectedBatch = batches.find((b) => b.id === selectedBatchId) || null;

  const updateBatch = (updatedBatch) => {
    setBatches((prev) =>
      prev.map((b) => (b.id === updatedBatch.id ? updatedBatch : b))
    );
  };

  const createBatch = (newBatch) => {
    setBatches((prev) => [...prev, newBatch]);
    setSelectedBatchId(newBatch.id);
  };

  const renderRolePage = () => {
    const commonProps = {
      batches,
      selectedBatch,
      setSelectedBatchId,
      updateBatch,
      createBatch,
    };

    switch (role) {
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
        // consumer only needs batches
        return <ConsumerPage batches={batches} />;
      default:
        return (
          <div style={{ padding: 16 }}>
            <p>No role assigned to this user.</p>
          </div>
        );
    }
  };

  // If user is not logged in -> show auth screens
  if (!currentUser) {
    return showSignup ? (
      <SignupPage onSwitchToLogin={() => setShowSignup(false)} />
    ) : (
      <LoginPage onSwitchToSignup={() => setShowSignup(true)} />
    );
  }

  // Logged in view
  return (
    <div className="app">
      <TopNav />
      {/* RoleTabs removed so user can't switch roles */}
      <main className="main-content">{renderRolePage()}</main>
    </div>
  );
}

export default App;
