// src/pages/DistributorPage.jsx
import React, { useState } from "react";
import BatchList from "../components/BatchList.jsx";
import BatchDetails from "../components/BatchDetails.jsx";
import QRModal from "../components/QRModal.jsx";
import { getDeviceLocationWithName } from "../utils/location.js";

function DistributorPage({
  batches,
  selectedBatch,
  setSelectedBatchId,
  updateBatch,
}) {
  const [distributorName, setDistributorName] = useState(
    "GreenSupply Logistics"
  );
  const [destination, setDestination] = useState(
    "Hyderabad – Regional Warehouse"
  );
  const [showQR, setShowQR] = useState(false);
  const [isCapturingLoc, setIsCapturingLoc] = useState(false);
  const [locPreview, setLocPreview] = useState("");

  const handleShip = async (e) => {
    e.preventDefault();
    if (!selectedBatch) return;

    setIsCapturingLoc(true);
    const locationInfo = await getDeviceLocationWithName();
    setIsCapturingLoc(false);

    const now = new Date();

    const newEvent = {
      type: "DISTRIBUTION",
      by: "Distributor",
      actorName: distributorName,
      timestamp: now.toLocaleString("en-IN"),
      details: `Shipped to ${destination}`,
      locationName: locationInfo.locationName,
      geo: locationInfo.coords,
    };

    const updated = {
      ...selectedBatch,
      status: "In Distribution",
      location: locationInfo.locationName || selectedBatch.location,
      geo: locationInfo.coords || selectedBatch.geo,
      events: [...selectedBatch.events, newEvent],
    };

    updateBatch(updated);
    setLocPreview("");
  };

  const handlePreviewLocation = async () => {
    setIsCapturingLoc(true);
    const locationInfo = await getDeviceLocationWithName();
    setIsCapturingLoc(false);

    const coordsText = locationInfo.coords
      ? `${locationInfo.coords.lat.toFixed(4)}, ${locationInfo.coords.lng.toFixed(
          4
        )}`
      : "";
    setLocPreview(`${locationInfo.locationName} ${coordsText && `(${coordsText})`}`);
  };

  return (
    <div className="grid-2 main-grid">
      <div>
        <div className="card">
          <h3>Distributor – Ship Batch</h3>
          {selectedBatch ? (
            <>
              <p>
                Selected Batch: <strong>{selectedBatch.id}</strong>
              </p>
              <form className="form" onSubmit={handleShip}>
                <label>
                  Distributor Name
                  <input
                    value={distributorName}
                    onChange={(e) => setDistributorName(e.target.value)}
                  />
                </label>
                <label>
                  Destination
                  <input
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                  />
                </label>

                <div className="location-helper">
                  <button
                    type="button"
                    className="secondary-btn"
                    onClick={handlePreviewLocation}
                  >
                    {isCapturingLoc ? "Getting location..." : "Use my device location"}
                  </button>
                  {locPreview && (
                    <p className="muted small">
                      Captured:{" "}
                      <span className="location-preview">{locPreview}</span>
                    </p>
                  )}
                </div>

                <button className="primary-btn" type="submit">
                  Record Shipment (with location)
                </button>
              </form>
            </>
          ) : (
            <p>Select a batch to ship.</p>
          )}
        </div>
      </div>

      <div>
        <BatchList
          batches={batches}
          selectedBatchId={selectedBatch?.id}
          onSelect={setSelectedBatchId}
        />
        <BatchDetails batch={selectedBatch} onShowQR={() => setShowQR(true)} />
      </div>

      {showQR && (
        <QRModal batch={selectedBatch} onClose={() => setShowQR(false)} />
      )}
    </div>
  );
}

export default DistributorPage;
