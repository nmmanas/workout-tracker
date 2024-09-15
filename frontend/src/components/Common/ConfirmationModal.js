import React from 'react';
import './ConfirmationModal.css'; // Create this CSS file for styling
import { FaSpinner } from 'react-icons/fa'; // Add this import

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="modal-actions">
          <button 
            onClick={onConfirm} 
            className="confirm-button" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <FaSpinner className="spinner" /> Processing...
              </>
            ) : (
              'Yes'
            )}
          </button>
          <button onClick={onClose} className="cancel-button" disabled={isLoading}>No</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;