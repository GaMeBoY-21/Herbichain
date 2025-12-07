// src/pages/ConsumerPage.jsx
import React, { useState } from "react";
import BatchDetails from "../components/BatchDetails.jsx";
import QRModal from "../components/QRModal.jsx";
import { API_BASE } from "../config.js"; // <- one level up from pages/

function ConsumerPage({ batches }) {
  const [input, setInput] = useState("");
  const [foundBatch, setFoundBatch] = useState(null);
  const [showQR, setShowQR] = useState(false);

  const [aiSummary, setAiSummary] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();

    const lowered = input.trim().toLowerCase();
    const batch = batches.find(
      (b) =>
        b.id?.toLowerCase() === lowered ||
        b.qrCodeValue?.toLowerCase() === lowered
    );

    setFoundBatch(batch || null);
    setAiSummary("");
    setAiError("");
  };

  const handleAskAI = async () => {
    if (!foundBatch) return;

    try {
      setAiLoading(true);
      setAiError("");
      setAiSummary("");

      const res = await fetch(`${API_BASE}/api/ai/timeline`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(foundBatch),
      });

      if (!res.ok) {
        throw new Error(`AI endpoint responded with ${res.status}`);
      }

      const data = await res.json();
      setAiSummary(data.summary || "No AI summary returned.");
    } catch (err) {
      console.error("Error generating AI timeline:", err);
      setAiError("AI could not generate explanation. Please try again.");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="main-grid">
      {/* LEFT SIDE PANEL */}
      <div className="card">
        <h3>Consumer – Verify Product</h3>

        <p className="muted">
          In a real product, the QR code on the packaging contains the batch ID.
          For the demo, enter the batch ID manually.
        </p>

        <form className="form" onSubmit={handleSearch}>
          <label>
            Batch ID / QR Value
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Example: BATCH-12345"
            />
          </label>

          <button className="primary-btn" type="submit">
            Verify Authenticity
          </button>
        </form>

        {!foundBatch && (
          <p className="muted small">
            Enter a valid batch ID to view details and AI insights.
          </p>
        )}

        {foundBatch && (
          <div className="ai-actions" style={{ marginTop: "1rem" }}>
            <button
              type="button"
              className="secondary-btn"
              onClick={handleAskAI}
              disabled={aiLoading}
            >
              {aiLoading ? "Asking AI..." : "Ask AI to explain the timeline"}
            </button>

            {aiError && <p className="auth-error">{aiError}</p>}
          </div>
        )}

        {aiSummary && (
          <div className="card ai-summary-card" style={{ marginTop: "1rem" }}>
            <h4>AI Explanation</h4>
            <p className="ai-summary-text">{aiSummary}</p>
          </div>
        )}
      </div>

      {/* RIGHT SIDE – Batch Details */}
      <BatchDetails batch={foundBatch} onShowQR={() => setShowQR(true)} />

      {showQR && (
        <QRModal batch={foundBatch} onClose={() => setShowQR(false)} />
      )}
    </div>
  );
}

export default ConsumerPage;
