// src/components/Timeline.jsx
import React from "react";

function Timeline({ events }) {
  if (!events || events.length === 0) {
    return <p>No events recorded yet.</p>;
  }

  const formatCoords = (geo) => {
    if (!geo) return "";
    const lat = Number(geo.lat).toFixed(4);
    const lng = Number(geo.lng).toFixed(4);
    return `${lat}, ${lng}`;
  };

  return (
    <ul className="timeline">
      {events.map((ev, idx) => (
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
            {ev.locationName && (
              <div className="timeline-location">
                Location: {ev.locationName}
                {ev.geo && (
                  <>
                    {" "}
                    (
                    <span className="timeline-coords">
                      {formatCoords(ev.geo)}
                    </span>
                    )
                  </>
                )}
              </div>
            )}
            {ev.labReportIpfsHash && (
              <div className="ipfs-hash">
                Lab Report IPFS Hash: {ev.labReportIpfsHash}
              </div>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

export default Timeline;
