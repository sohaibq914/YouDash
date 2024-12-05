import React from "react";
import "./ConfirmationModal.css"; // Add your styles here

const ConfirmationModal = ({ isOpen, onConfirm, onCancel, message }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p>{message}</p>
        <div className="modal-buttons">
          <button onClick={onConfirm} className="confirm-btn">Yes</button>
          <button onClick={onCancel} className="cancel-btn">No</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
