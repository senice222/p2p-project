import React from 'react'
import backgroundImage from '../assets/Group 2.png'
import styles from '../styles/BackgroundLayout.module.scss'
import { Typography } from '../shared/ui/Typography/Typography'
import { Logo } from '../shared/icons/Logo'
import PaymentInstructions from '../components/PaymentInstructions'
import { useModalSearchStore } from '../widgets/search/model/store'

const BackgroundLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { isOpen, closeModal } = useModalSearchStore()

  return (
    <div className={styles.container}>
      <PaymentInstructions
        isOpen={isOpen}
        onClose={() => closeModal()}
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
          <Typography variant="h1" color="white" fontSize="22px" fontWeight="600" lineHeight="100%">
            P2P Market
          </Typography>
        </div>
      </div>
      <div className={styles.gradientOverlay} />

        {children}
    </div>
  )
}

export default BackgroundLayout