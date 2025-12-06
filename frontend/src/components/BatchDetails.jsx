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

  const formatCoords = (geo) => {
    if (!geo) return "";
    const lat = Number(geo.lat).toFixed(4);
    const lng = Number(geo.lng).toFixed(4);
    return `${lat}, ${lng}`;
  };

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
            <strong>Species:</strong> {batch.species}
          </p>
          <p>
            <strong>Farmer:</strong> {batch.farmerName}
          </p>
          <p>
            <strong>Location:</strong> {batch.location || batch.locationName}
          </p>
        </div>
        <div>
          <p>
            <strong>Status:</strong> {batch.status}
          </p>
          {batch.geo && (
            <p>
              <strong>Geo-tag:</strong> {formatCoords(batch.geo)}
            </p>
          )}
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
