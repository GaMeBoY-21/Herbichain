// src/pages/ManufacturerPage.jsx
import React, { useState } from "react";
import BatchList from "../components/BatchList.jsx";
import BatchDetails from "../components/BatchDetails.jsx";
import QRModal from "../components/QRModal.jsx";
import { getDeviceLocationWithName } from "../utils/location.js";

function ManufacturerPage({
  batches,
  selectedBatch,
  setSelectedBatchId,
  updateBatch,
}) {
  const [manufacturerName, setManufacturerName] = useState(
    "HerbalCare Pvt Ltd"
  );
  const [productInfo, setProductInfo] = useState(
    "Converted to Ashwagandha capsules – pack of 60."
  );
  const [showQR, setShowQR] = useState(false);
  const [isCapturingLoc, setIsCapturingLoc] = useState(false);
  const [locPreview, setLocPreview] = useState("");

  const handleManufacture = async (e) => {
    e.preventDefault();
    if (!selectedBatch) return;

    setIsCapturingLoc(true);
    const locationInfo = await getDeviceLocationWithName();
    setIsCapturingLoc(false);

    const now = new Date();

    const newEvent = {
      type: "MANUFACTURING",
      by: "Manufacturer",
      actorName: manufacturerName,
      timestamp: now.toLocaleString("en-IN"),
      details: productInfo,
      locationName: locationInfo.locationName,
      geo: locationInfo.coords,
    };

    const updated = {
      ...selectedBatch,
      status: "Processed by Manufacturer",
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
          <h3>Manufacturer – Process Batch</h3>
          {selectedBatch ? (
            <>
              <p>
                Selected Batch: <strong>{selectedBatch.id}</strong>
              </p>
              <form className="form" onSubmit={handleManufacture}>
                <label>
                  Manufacturer Name
                  <input
                    value={manufacturerName}
                    onChange={(e) => setManufacturerName(e.target.value)}
                  />
                </label>
                <label>
                  Product Details
                  <textarea
                    value={productInfo}
                    onChange={(e) => setProductInfo(e.target.value)}
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
                  Record Manufacturing Step (with location)
                </button>
              </form>
            </>
          ) : (
            <p>Select a batch to process.</p>
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

export default ManufacturerPage;
