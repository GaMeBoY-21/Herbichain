// src/pages/LabPage.jsx
import React, { useState } from "react";
import BatchList from "../components/BatchList.jsx";
import BatchDetails from "../components/BatchDetails.jsx";
import QRModal from "../components/QRModal.jsx";
import { getDeviceLocationWithName } from "../utils/location.js";

function LabPage({
  batches,
  selectedBatch,
  setSelectedBatchId,
  updateBatch,
}) {
  const [labName, setLabName] = useState("AyurLab Pune");
  const [reportHash, setReportHash] = useState("QmXYZ999");
  const [comments, setComments] = useState(
    "Passed – within permissible limits."
  );
  const [showQR, setShowQR] = useState(false);
  const [isCapturingLoc, setIsCapturingLoc] = useState(false);
  const [locPreview, setLocPreview] = useState("");

  const captureLocation = async () => {
    setIsCapturingLoc(true);
    const locationInfo = await getDeviceLocationWithName();
    setIsCapturingLoc(false);

    const coordsText =
      locationInfo.coords &&
      `${locationInfo.coords.lat.toFixed(4)}, ${locationInfo.coords.lng.toFixed(
        4
      )}`;

    setLocPreview(
      locationInfo.locationName || coordsText || "Location not available"
    );

    return locationInfo;
  };

  const handlePreviewLocation = async () => {
    await captureLocation();
  };

  const handleAddTest = async (e) => {
    e.preventDefault();
    if (!selectedBatch) return;

    const locationInfo = await captureLocation();
    const now = new Date();

    const locName =
      locationInfo.locationName ||
      selectedBatch.locationName ||
      selectedBatch.location ||
      (locationInfo.coords
        ? `${locationInfo.coords.lat.toFixed(
            4
          )}, ${locationInfo.coords.lng.toFixed(4)}`
        : "Unknown location");

    const newEvent = {
      type: "LAB_TEST",
      by: "Lab",
      actorName: labName,
      timestamp: now.toLocaleString("en-IN"),
      details: comments,
      labReportIpfsHash: reportHash,
      locationName: locName,
      geo: locationInfo.coords || selectedBatch.geo || null,
    };

    const updated = {
      ...selectedBatch,
      status: "Lab Tested",
      location: locName,
      locationName: locName,
      geo: locationInfo.coords || selectedBatch.geo || null,
      events: [...selectedBatch.events, newEvent],
    };

    updateBatch(updated);
    setLocPreview("");
  };

  return (
    <div className="main-grid">
      <div>
        <div className="card">
          <h3>Lab – Add Test Result</h3>
          {selectedBatch ? (
            <>
              <p>
                Selected Batch: <strong>{selectedBatch.id}</strong>
              </p>
              <form className="form" onSubmit={handleAddTest}>
                <label>
                  Lab Name
                  <input
                    value={labName}
                    onChange={(e) => setLabName(e.target.value)}
                  />
                </label>
                <label>
                  IPFS Hash (Demo)
                  <input
                    value={reportHash}
                    onChange={(e) => setReportHash(e.target.value)}
                  />
                </label>
                <label>
                  Comments
                  <textarea
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
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
                  Attach Test Result (with location)
                </button>
              </form>
            </>
          ) : (
            <p>Select a batch from the right to add test result.</p>
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

export default LabPage;
