// src/pages/ConsumerPage.jsx
import React, { useState } from "react";
import BatchDetails from "../components/BatchDetails.jsx";
import QRModal from "../components/QRModal.jsx";

function ConsumerPage({ batches }) {
  const [input, setInput] = useState("");
  const [foundBatch, setFoundBatch] = useState(null);
  const [showQR, setShowQR] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    const value = input.trim().toLowerCase();

    const batch = batches.find((b) => {
      const idMatch = b.id && b.id.toLowerCase() === value;
      const qrMatch =
        b.qrCodeValue &&
        b.qrCodeValue.toLowerCase() === value;
      return idMatch || qrMatch;
    });

    setFoundBatch(batch || null);
  };

  return (
    <div className="main-grid">
      <div className="card">
        <h3>Consumer – Verify Product</h3>
        <p className="muted small">
          Enter the <strong>Batch ID</strong> or <strong>QR value</strong>{" "}
          printed on the product.  
          (Only batches processed by the <strong>Manufacturer</strong> will
          have a QR.)
        </p>
        <form className="form" onSubmit={handleSearch}>
          <label>
            Batch ID / QR Value
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g. BATCH-057122"
            />
          </label>
          <button className="primary-btn" type="submit">
            Verify Authenticity
          </button>
        </form>
        {!foundBatch && (
          <p className="muted">
            No batch selected yet. Try a known batch ID after manufacturing is
            recorded.
          </p>
        )}
      </div>

      <BatchDetails batch={foundBatch} onShowQR={() => setShowQR(true)} />

      {showQR && (
        <QRModal batch={foundBatch} onClose={() => setShowQR(false)} />
      )}
    </div>
  );
}

export default ConsumerPage;
