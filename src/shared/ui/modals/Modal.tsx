import React, { ReactNode, useState, useEffect } from 'react'
import styles from '../../../styles/Modal.module.scss'
import CloseIcon from '../../icons/Cross';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  hideCloseButton?: boolean;
  disableOverlayClick?: boolean;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title, hideCloseButton = false, disableOverlayClick = false }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  // Фиксируем скролл основного содержимого при открытии модального окна
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

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

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !disableOverlayClick) {
      onClose();
    }
  };

  return (
    <div className={overlayClass} onClick={handleOverlayClick}>
      <div className={contentClass} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          {title && <h2 className={styles.modalTitle}>{title}</h2>}
          {!hideCloseButton && (
            <button className={styles.closeButton} onClick={handleClose}>
              <CloseIcon />
            </button>
          )}
        </div>
        <div className={styles.modalBody}>
          {children}
        </div>
      </div>
    </div>
  )
}

export default Modal
