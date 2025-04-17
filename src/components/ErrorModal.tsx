import React from 'react';
import { Typography } from '../shared/ui/Typography/Typography';
import styles from '../styles/ErrorModal.module.scss';
import Danger from '../shared/icons/Danger';

interface ErrorModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onClose: () => void;
}

const ErrorModal: React.FC<ErrorModalProps> = ({ isOpen, title, message, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <div className={styles.errorIcon}>
            <Danger />
          </div>
          <Typography variant="h6" color="white" fontSize="16px" fontWeight="450">
            {title}
          </Typography>
          <button className={styles.closeButton} onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 6L18 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className={styles.modalDivider} />

        <div className={styles.modalBody}>
          <Typography color="#fff" fontSize="16px" fontWeight="450">
            {message}
          </Typography>
        </div>

        <div className={styles.modalFooter}>
          <button
            onClick={onClose}
            className={styles.confirmButton}
          >
            Понятно
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;
