import React, { ReactNode, useState, useEffect } from 'react'
import styles from '../../../styles/Modal.module.scss'
import Cross from '../../icons/Cross';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
      setShouldRender(true);
    } else if (shouldRender) {
      setIsClosing(true);
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    const timer = setTimeout(() => {
      onClose();
    }, 300);
    return () => clearTimeout(timer);
  };

  if (!shouldRender) return null;

  const overlayClass = `${styles.modalOverlay} ${isClosing ? styles.closing : ''}`;
  const contentClass = `${styles.modalContent} ${isClosing ? styles.closing : ''}`;

  return (
    <div className={overlayClass} onClick={handleClose}>
      <div className={contentClass} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          {title && <h2 className={styles.modalTitle}>{title}</h2>}
          <button className={styles.closeButton} onClick={handleClose}>
            <Cross />
          </button>
        </div>
        <div className={styles.modalBody}>
          {children}
        </div>
      </div>
    </div>
  )
}

export default Modal
