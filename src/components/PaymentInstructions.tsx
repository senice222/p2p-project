import React, { useState } from 'react';
import Modal from '../shared/ui/modals/Modal';
import styles from '../styles/PaymentInstructions.module.scss';
import Button from '../shared/ui/button/Button';

interface PaymentInstructionsProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  type: 'card' | 'sbp';
  isOrderCreation?: boolean;
}

const PaymentInstructions: React.FC<PaymentInstructionsProps> = ({
  isOpen,
  onClose,
  onConfirm,
  type,
  isOrderCreation = false
}) => {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const handleConfirm = () => {
    if (isOrderCreation && dontShowAgain) {
      // Сохраняем в localStorage флаг, что не нужно показывать инструкцию перед созданием ордера
      localStorage.setItem('hideOrderCreationInstructions', 'true');
    }
    onConfirm();
  };

  const regularSteps = [
    {
      number: 1,
      text: 'Скопируйте номер телефона'
    },
    {
      number: 2,
      text: 'Вставьте номер телефона в своем банке и укажите банк получатель, который будет указан в платеже'
    },
    {
      number: 3,
      text: 'Нажмите Я оплатил после оплаты'
    },
    {
      number: 4,
      text: 'Предоставьте чек на следующей странице'
    }
  ];

  const cardSteps = [
    {
      number: 1,
      text: 'Мы покажем вам КАРТУ и СУММУ к оплате.'
    },
    {
      number: 2,
      text: 'В течение <b>15 минут</b> вам нужно перевести указанную сумму на выданные реквизиты.'
    },
    {
      number: 3,
      text: 'После оплаты обязательно нажмите кнопку "Я оплатил" и прикрепите чек.'
    },
    {
      number: 4,
      text: 'Важно! На оплату и загрузку чека у вас есть по <b>15 минут</b>. Если не успеете — платеж получит статус "ИСТЕК", и средства возвращены <b>НЕ БУДУТ</b>.'
    }
  ];

  const sbpSteps = [
    {
      number: 1,
      text: 'Мы покажем вам НОМЕР телефона, БАНК получателя и СУММУ.'
    },
    {
      number: 2,
      text: 'Переведите указанную сумму по выданным реквизитам в нужный банк.'
    },
    {
      number: 3,
      text: 'После оплаты обязательно нажмите кнопку "Я оплатил" и прикрепите чек.'
    },
    {
      number: 4,
      text: 'Обратите внимание! На оплату и загрузку чека у вас есть по <b>15 минут</b>. Если не успеете — платеж получит статус "ИСТЕК", и средства возвращены <b>НЕ БУДУТ</b>. В случае отправки на другой БАНК, средства будут утеряны'
    }
  ];

  const steps = isOrderCreation ? (type === 'card' ? cardSteps : sbpSteps) : regularSteps;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Инструкция по оплате"
      hideCloseButton={isOrderCreation}
      disableOverlayClick={isOrderCreation}
    >
      <div className={styles.line} />
      <div className={styles.instructionsList}>
        {steps.map((step) => (
          <div
            key={step.number}
            className={styles.instructionStep}
          >
            <div className={styles.stepNumber}>{step.number}</div>
            <div
              className={styles.stepContent}
              dangerouslySetInnerHTML={{ __html: step.text }}
            />
          </div>
        ))}
      </div>
      {isOrderCreation && (
        <div className={styles.dontShowAgain} onClick={(e) => e.stopPropagation()}>
          <label>
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
            />
            <span>Больше не показывать</span>
          </label>
        </div>
      )}
      <div className={styles.modalFooter}>
        <Button onClick={handleConfirm}>
          Подтвердить
        </Button>
      </div>
    </Modal>
  );
};

export default PaymentInstructions;
