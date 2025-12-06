// src/components/Timeline.jsx
import React from "react";

function Timeline({ events }) {
  if (!events || events.length === 0) {
    return <p>No events recorded yet.</p>;
  }

  return (
    <ul className="timeline">
      {events.map((ev, idx) => {
        const coordsText =
          ev.geo && ev.geo.lat && ev.geo.lng
            ? `${ev.geo.lat.toFixed(4)}, ${ev.geo.lng.toFixed(4)}`
            : null;

        return (
          <li key={idx} className="timeline-item">
            <div className="timeline-marker" />
            <div className="timeline-content">
              <div className="timeline-header">
                <strong>{ev.type}</strong>
                <span className="timeline-time">{ev.timestamp}</span>
              </div>
              <p>{ev.details}</p>
              <small>
                By: {ev.actorName} ({ev.by})
              </small>
              {(ev.locationName || coordsText) && (
                <p className="muted small">
                  Location: {ev.locationName || "Unknown"}
                  {coordsText && ` (${coordsText})`}
                </p>
              )}
              {ev.labReportIpfsHash && (
                <div className="ipfs-hash">
                  Lab Report IPFS Hash: {ev.labReportIpfsHash}
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default Timeline;
