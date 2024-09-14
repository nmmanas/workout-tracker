import React from 'react';
import './ConfirmationModal.css'; // Create this CSS file for styling

const ConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Confirm Discard Draft</h3>
        <p>Are you sure you want to discard the draft workout?</p>
        <div className="modal-actions">
          <button onClick={onConfirm} className="confirm-button">Yes</button>
          <button onClick={onClose} className="cancel-button">No</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;