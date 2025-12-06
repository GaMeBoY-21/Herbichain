// src/components/QRModal.jsx
import React from "react";

function QRModal({ batch, onClose }) {
  if (!batch) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>QR Code – {batch.id}</h3>
          <button className="icon-btn" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="modal-body">
          <p>
            In the real system, this QR code will be printed on packaging. When
            scanned, the consumer will see this exact batch history.
          </p>
          <div className="fake-qr">
            <span>{batch.qrCodeValue}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QRModal;
