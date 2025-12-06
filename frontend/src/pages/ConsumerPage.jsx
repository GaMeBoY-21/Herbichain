// src/pages/ConsumerPage.jsx
import React, { useState } from "react";
import BatchDetails from "../components/BatchDetails.jsx";
import QRModal from "../components/QRModal.jsx";

function ConsumerPage({ batches }) {
  const [input, setInput] = useState("");
  const [foundBatch, setFoundBatch] = useState(null);
  const [showQR, setShowQR] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    const value = input.trim();

    if (!value) {
      setError("Please enter the batch ID printed near the QR code.");
      setFoundBatch(null);
      return;
    }

    const batch = batches.find(
      (b) =>
        b.id.toLowerCase() === value.toLowerCase() ||
        b.qrCodeValue.toLowerCase() === value.toLowerCase()
    );

    if (!batch) {
      setFoundBatch(null);
      setError("No batch found. Check the ID and try again.");
    } else {
      setFoundBatch(batch);
      setError("");
    }
  };

  return (
    <div className="consumer-page">
      {/* Search card */}
      <div className="card">
        <h3>Consumer – Verify Product</h3>
        <p>
          In the real world, you simply scan the QR on the pack. For this demo,
          type a batch ID like <code>BATCH-001</code>.
        </p>

        <form className="form" onSubmit={handleSearch}>
          <label>
            Batch ID / QR Value
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="BATCH-001"
            />
          </label>
          <button className="primary-btn" type="submit">
            Verify Authenticity
          </button>
        </form>

        {!foundBatch && !error && (
          <p className="muted">
            Tip: try <code>BATCH-001</code> to see a full traceability demo.
          </p>
        )}
        {error && <p className="error-text">{error}</p>}
      </div>

      {/* Only show details when we have a batch */}
      {foundBatch && (
        <BatchDetails
          batch={foundBatch}
          onShowQR={() => setShowQR(true)}
        />
      )}

      {showQR && (
        <QRModal batch={foundBatch} onClose={() => setShowQR(false)} />
      )}
    </div>
  );
}

export default ConsumerPage;
