import React from 'react';
import Modal from '../shared/ui/modals/Modal';
import styles from '../styles/PaymentInstructions.module.scss';

interface PaymentInstructionsProps {
  isOpen: boolean;
  onClose: () => void;
}

const PaymentInstructions: React.FC<PaymentInstructionsProps> = ({ isOpen, onClose }) => {
  const steps = [
    {
      number: 1,
      text: 'Зайдите на',
      link: {
        text: 'izt.market',
        url: 'https://izt.market'
      }
    },
    {
      number: 2,
      text: 'Справа сверху нажмите на свою аватарку и нажмите "Мой Профиль"'
    },
    {
      number: 3,
      text: 'Справа от аватарки будет указан Ваш ник'
    },
    {
      number: 4,
      text: 'Перепроверьте все данные после ввода ника, мы покажем вам вашу аватарку, ник и ссылку на профиль'
    }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Инструкция по оплате">
      <div className={styles.line} />
      <div className={styles.instructionsList}>
        {steps.map((step, index) => (
          <div
            key={step.number}
            className={styles.instructionStep}
            style={{ '--step-index': index } as React.CSSProperties}
          >
            <div className={styles.stepNumber}>{step.number}</div>
            <div className={styles.stepContent}>
              {step.link ? (
                <span>
                  {step.text}{' '}
                  <a href={step.link.url} target="_blank" rel="noopener noreferrer" className={styles.link}>
                    {step.link.text}
                  </a>
                </span>
              ) : (
                step.text
              )}
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default PaymentInstructions;
