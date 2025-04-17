import React from 'react'
import backgroundImage from '../assets/Group 2.png'
import styles from '../styles/BackgroundLayout.module.scss'
import { Typography } from '../shared/ui/Typography/Typography'
import { Logo } from '../shared/icons/Logo'
import PaymentInstructions from '../components/PaymentInstructions'
import ErrorModal from '../components/ErrorModal'
import { useModalSearchStore } from '../widgets/search/model/store'
import { useErrorModalStore } from '../shared/store/errorModalStore'

const BackgroundLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { isOpen, closeModal } = useModalSearchStore()
  const { isOpen: isErrorOpen, errorType, errorMessage, closeModal: closeErrorModal } = useErrorModalStore()

  // Проверяем, нужно ли показывать инструкцию
  const shouldShowInstructions = !localStorage.getItem('hidePaymentInstructions');

  // Функция для определения заголовка ошибки по её типу
  const getErrorTitle = () => {
    switch (errorType) {
      case 'too_many_active_payments':
        return 'Слишком много активных платежей';
      case 'general_error':
        return 'Ошибка!';
      default:
        return 'Ошибка!';
    }
  };

  return (
    <div className={styles.container}>
      <PaymentInstructions
        isOpen={isOpen && shouldShowInstructions}
        onClose={() => closeModal()}
        onConfirm={() => closeModal()}
        type="card"
      />
      <ErrorModal
        isOpen={isErrorOpen}
        title={getErrorTitle()}
        message={errorMessage}
        onClose={closeErrorModal}
      />
      <img
        src={backgroundImage}
        alt="background"
        className={styles.backgroundImage}
      />
      <div className={styles.innerGlow} />
      <div className={styles.overlayText}>
        <div className={styles.logoContainer}>
          <Logo />
          <Typography variant="h1" color="white" fontSize="22px" fontWeight="500" lineHeight="100%">
            P2P Market
          </Typography>
        </div>
      </div>
      <div className={styles.gradientOverlay}>
        {children}
      </div>
    </div>
  )
}

export default BackgroundLayout
