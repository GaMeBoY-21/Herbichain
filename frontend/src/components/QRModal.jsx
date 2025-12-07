// src/components/QRModal.jsx
import React from "react";

function QRModal({ batch, onClose }) {
  if (!batch) return null;

  const hasQr = !!batch.qrCodeValue;

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
          {hasQr ? (
            <>
              <p>
                This QR will be printed on the final product packaging. Scanning
                it will show this batch’s full history.
              </p>
              <div className="fake-qr">
                <span>{batch.qrCodeValue}</span>
              </div>
            </>
          ) : (
            <p>
              QR code has not been generated yet. Ask the Manufacturer to record
              the manufacturing step – that will create the QR.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default QRModal;
