// src/components/BatchList.jsx
import React from "react";

function BatchList({ batches, selectedBatchId, onSelect }) {
  return (
    <div className="card">
      <h3>Batches</h3>
      {batches.length === 0 && <p>No batches yet.</p>}
      <ul className="batch-list">
        {batches.map((b) => (
          <li
            key={b.id}
            className={
              "batch-list-item" + (b.id === selectedBatchId ? " selected" : "")
            }
            onClick={() => onSelect(b.id)}
          >
            <div className="batch-id">{b.id}</div>
            <div className="batch-meta">
              <span>{b.herbName}</span>
              <span className="status-pill">{b.status}</span>
            </div>
            <small>Farmer: {b.farmerName}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BatchList;
