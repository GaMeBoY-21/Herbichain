// src/pages/FarmerPage.jsx
import React, { useState } from "react";
import BatchList from "../components/BatchList.jsx";
import BatchDetails from "../components/BatchDetails.jsx";
import QRModal from "../components/QRModal.jsx";
import { getDeviceLocationWithName } from "../utils/location.js";

function FarmerPage({
  batches,
  selectedBatch,
  setSelectedBatchId,
  createBatch,
}) {
  const [form, setForm] = useState({
    herbName: "",
    species: "",
    farmerName: "",
  });
  const [showQR, setShowQR] = useState(false);
  const [locPreview, setLocPreview] = useState("");
  const [isCapturingLoc, setIsCapturingLoc] = useState(false);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

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

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.herbName || !form.farmerName) return;

    const locationInfo = await captureLocation();
    const now = new Date();

    const id = "BATCH-" + String(Date.now()).slice(-6);

    const locName =
      locationInfo.locationName ||
      (locationInfo.coords
        ? `${locationInfo.coords.lat.toFixed(
            4
          )}, ${locationInfo.coords.lng.toFixed(4)}`
        : "Unknown location");

    const newBatch = {
      id,
      herbName: form.herbName,
      species: form.species,
      farmerName: form.farmerName,
      location: locName,
      locationName: locName,
      geo: locationInfo.coords, // { lat, lng } or null
      status: "Harvested",
      // 🔴 QR is NOT generated at farmer stage
      qrCodeValue: null,
      events: [
        {
          type: "HARVEST",
          by: "Farmer",
          actorName: form.farmerName,
          timestamp: now.toLocaleString("en-IN"),
          details: `Harvested ${form.herbName}.`,
          locationName: locName,
          geo: locationInfo.coords,
        },
      ],
    };

    createBatch(newBatch);
    setForm({
      herbName: "",
      species: "",
      farmerName: "",
    });
    setLocPreview("");
  };

  return (
    <div className="main-grid">
      <div>
        <div className="card">
          <h3>Farmer – Create New Batch</h3>
          <form className="form" onSubmit={handleCreate}>
            <label>
              Herb Name*
              <input
                name="herbName"
                value={form.herbName}
                onChange={handleChange}
                placeholder="Ashwagandha roots"
                required
              />
            </label>
            <label>
              Species
              <input
                name="species"
                value={form.species}
                onChange={handleChange}
                placeholder="Withania somnifera"
              />
            </label>
            <label>
              Farmer Name*
              <input
                name="farmerName"
                value={form.farmerName}
                onChange={handleChange}
                placeholder="Ramesh Kumar"
                required
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
              Create Batch &amp; Record (with device location)
            </button>
          </form>
        </div>

        <BatchList
          batches={batches}
          selectedBatchId={selectedBatch?.id}
          onSelect={setSelectedBatchId}
        />
      </div>

      <div>
        <BatchDetails batch={selectedBatch} onShowQR={() => setShowQR(true)} />
      </div>

      {showQR && (
        <QRModal batch={selectedBatch} onClose={() => setShowQR(false)} />
      )}
    </div>
  );
}

export default FarmerPage;
