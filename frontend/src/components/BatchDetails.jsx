// src/components/BatchDetails.jsx
import React from "react";
import Timeline from "./Timeline.jsx";

function BatchDetails({ batch, onShowQR }) {
  if (!batch) {
    return (
      <div className="card">
        <h3>Batch Details</h3>
        <p>Select a batch to view details.</p>
      </div>
    );
  }

  const locName = batch.locationName || batch.location || "Unknown location";
  const coordsText =
    batch.geo && batch.geo.lat && batch.geo.lng
      ? `${batch.geo.lat.toFixed(4)}, ${batch.geo.lng.toFixed(4)}`
      : null;

  return (
    <div className="card">
      <div className="card-header-row">
        <h3>Batch Details – {batch.id}</h3>
        <button className="primary-btn" onClick={onShowQR}>
          View / Scan QR
        </button>
      </div>

      <div className="grid-2">
        <div>
          <p>
            <strong>Herb:</strong> {batch.herbName}
          </p>
          <p>
            <strong>Species:</strong> {batch.species || "—"}
          </p>
          <p>
            <strong>Farmer:</strong> {batch.farmerName || "—"}
          </p>
          <p>
            <strong>Location:</strong> {locName}
            {coordsText && (
              <>
                {" "}
                <span className="muted small">({coordsText})</span>
              </>
            )}
          </p>
        </div>
        <div>
          <p>
            <strong>Status:</strong> {batch.status}
          </p>
          <p>
            <strong>QR Value:</strong> {batch.qrCodeValue}
          </p>
        </div>
      </div>

      <h4>Lifecycle</h4>
      <Timeline events={batch.events} />
    </div>
  );
}

export default BatchDetails;
