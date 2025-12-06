// src/pages/FarmerPage.jsx
import React, { useState } from "react";
import BatchList from "../components/BatchList.jsx";
import BatchDetails from "../components/BatchDetails.jsx";
import QRModal from "../components/QRModal.jsx";
import { getDeviceLocationWithName } from "../utils/location.js";

function FarmerPage({ batches, selectedBatch, setSelectedBatchId, createBatch }) {
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

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.herbName || !form.farmerName) return;

    setIsCapturingLoc(true);
    const locationInfo = await getDeviceLocationWithName();
    setIsCapturingLoc(false);

    const id = "BATCH-" + String(Date.now()).slice(-5);
    const now = new Date();

    const newBatch = {
      id,
      herbName: form.herbName,
      species: form.species,
      farmerName: form.farmerName,
      location: locationInfo.locationName,
      geo: locationInfo.coords,
      status: "Harvested",
      qrCodeValue: id,
      events: [
        {
          type: "HARVEST",
          by: "Farmer",
          actorName: form.farmerName,
          timestamp: now.toLocaleString("en-IN"),
          details: `Harvested ${form.herbName}.`,
          locationName: locationInfo.locationName,
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
          <h3>Farmer – Create New Batch</h3>
          <form className="form" onSubmit={handleCreate}>
            <label>
              Herb Name*
              <input
                name="herbName"
                value={form.herbName}
                onChange={handleChange}
                placeholder="Ashwagandha roots"
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
                  Captured: <span className="location-preview">{locPreview}</span>
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
