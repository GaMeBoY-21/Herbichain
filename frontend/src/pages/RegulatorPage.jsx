// src/pages/RegulatorPage.jsx
import React from "react";
import BatchList from "../components/BatchList.jsx";
import BatchDetails from "../components/BatchDetails.jsx";
import QRModal from "../components/QRModal.jsx";

function RegulatorPage({
  batches,
  selectedBatch,
  setSelectedBatchId,
}) {
  const [showQR, setShowQR] = React.useState(false);

  const suspiciousBatches = batches.filter(
    (b) => !b.events.some((ev) => ev.type === "LAB_TEST")
  );

  return (
    <div className="grid-2 main-grid">
      <div>
        <div className="card">
          <h3>Regulator – Oversight Dashboard</h3>
          <p>
            Ministry of AYUSH can verify end-to-end traceability, lab tests, and
            recall high-risk batches.
          </p>

          <h4>Potentially High-Risk Batches (No Lab Test)</h4>
          {suspiciousBatches.length === 0 ? (
            <p>All current batches are lab tested 🎉</p>
          ) : (
            <ul className="batch-list">
              {suspiciousBatches.map((b) => (
                <li
                  key={b.id}
                  className="batch-list-item"
                  onClick={() => setSelectedBatchId(b.id)}
                >
                  <div className="batch-id">{b.id}</div>
                  <div className="batch-meta">
                    <span>{b.herbName}</span>
                    <span className="status-pill warning">No Lab Test</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div>
        <BatchList
          batches={batches}
          selectedBatchId={selectedBatch?.id}
          onSelect={setSelectedBatchId}
        />
        <BatchDetails
          batch={selectedBatch}
          onShowQR={() => setShowQR(true)}
        />
      </div>

      {showQR && (
        <QRModal batch={selectedBatch} onClose={() => setShowQR(false)} />
      )}
    </div>
  );
}

export default RegulatorPage;
