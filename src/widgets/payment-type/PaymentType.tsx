import { Typography } from '../../shared/ui/Typography'
import styles from '../../styles/PaymentType.module.scss'
import { useStepStore } from '../steps/models/store'
import Button from '../../shared/ui/button/Button'
import { useOrderStore } from '../../shared/store/orderStore'
import { useEffect, useState } from 'react'
import PaymentInstructions from '../../components/PaymentInstructions'

import sbpQr from '../../assets/sbp-logo.svg'
import mir from '../../assets/mir-logo.svg'
import visa from '../../assets/visa-logo.svg'
import mastercard from '../../assets/mastercard-logo.svg'
import visaUa from '../../assets/visa-logo.svg'
import mastercardUa from '../../assets/mastercard-logo.svg'
import qrIcon from '../../assets/sbp-qr.svg'
import phoneIcon from '../../assets/sbp-phone.svg'
import { useGetPaymentMethods, useCreateOrder } from '../../shared/api/payment-hooks'
import { AxiosError } from 'axios'
import { ApiErrorResponse } from '../choose-bank/ChooseBank'
import { useErrorModalStore } from '../../shared/store/errorModalStore'

interface PaymentMethodUI {
  id: number;
  title: string;
  icon: string | string[];
  type: string;
  discount: string | null;
  additionalIcon?: string;
  payment_method_type: string;
  need_select_bank: boolean;
  max_discount_percent: number;
}

const PaymentType = () => {
  const { setStep } = useStepStore()
  const { paymentMethodTypes, setSelectedPaymentMethod, setPaymentMethods, setOrderData, amount, user } = useOrderStore()
  const [selectedMethod, setSelectedMethod] = useState<number | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [availablePaymentMethods, setAvailablePaymentMethods] = useState<PaymentMethodUI[]>([]);
  const { mutateAsync: getPaymentMethods, isPending } = useGetPaymentMethods()
  const { mutateAsync: createOrder } = useCreateOrder()
  const { openModal: openErrorModal } = useErrorModalStore()

  useEffect(() => {
    if (!paymentMethodTypes) return;

    const methods: PaymentMethodUI[] = [];

    paymentMethodTypes.forEach((method) => {
      const { payment_method_type, need_select_bank, max_discount_percent } = method;

      if (payment_method_type === 'qr_rub') {
        methods.push({
          id: 17,
          title: 'СБП QR Code',
          icon: sbpQr,
          type: 'qr',
          discount: max_discount_percent > 0 ? `-${max_discount_percent}%` : null,
          additionalIcon: qrIcon,
          payment_method_type,
          need_select_bank,
          max_discount_percent
        });
      } else if (payment_method_type === 'phone_rub') {
        methods.push({
          id: 18,
          title: 'СБП по номеру',
          icon: sbpQr,
          type: 'phone',
          discount: max_discount_percent > 0 ? `-${max_discount_percent}%` : null,
          additionalIcon: phoneIcon,
          payment_method_type,
          need_select_bank,
          max_discount_percent
        });
      } else if (payment_method_type === 'card_rub') {
        methods.push({
          id: 19,
          title: 'Карты России',
          icon: [mir, visa, mastercard],
          type: 'ru_cards',
          discount: max_discount_percent > 0 ? `-${max_discount_percent}%` : null,
          payment_method_type,
          need_select_bank,
          max_discount_percent
        });
      } else if (payment_method_type === 'card_uah') {
        methods.push({
          id: 20,
          title: 'Карты Украины',
          icon: [visaUa, mastercardUa],
          type: 'ua_cards',
          discount: max_discount_percent > 0 ? `-${max_discount_percent}%` : null,
          payment_method_type,
          need_select_bank,
          max_discount_percent
        });
      }
    });

    setAvailablePaymentMethods(methods);
  }, [paymentMethodTypes]);

  const handleConfirm = () => {
    if (selectedMethod === null) return;

    const selectedPaymentMethod = availablePaymentMethods.find(method => method.id === selectedMethod);
    if (selectedPaymentMethod) {
      const { payment_method_type, need_select_bank, max_discount_percent } = selectedPaymentMethod;
      setSelectedPaymentMethod({ payment_method_type, need_select_bank, max_discount_percent });

      if (!need_select_bank) {
        if (!amount || !user) return;

        createOrder({
          amount,
          payment_method_id: selectedPaymentMethod.id,
          lolz_user_id: user.user_id
        }, {
          onSuccess: (data) => {
            setOrderData(data);
            const hideInstructions = localStorage.getItem('hideOrderCreationInstructions') === 'true';
            if (hideInstructions) {
              setStep(4);
            } else {
              setShowInstructions(true);
            }
          },
          onError: (error: Error) => {
            const axiosError = error as AxiosError;
            if (axiosError.response && axiosError.response.data) {
              const { type, message } = axiosError.response.data as ApiErrorResponse;

              if (type === 'too_many_active_payments') {
                openErrorModal('too_many_active_payments', message || 'У вас слишком много платежей, ожидающих проверки. Попробуйте позже');
                setStep(0)
              } else {
                openErrorModal('general_error', message || 'Произошла ошибка при создании заказа. Попробуйте еще раз.');
                setStep(0)
              }
            } else {
              openErrorModal('general_error', 'Не удалось создать заказ. Проверьте соединение с интернетом и попробуйте еще раз.');
            }
          }
        });
      } else {
        getPaymentMethods({
          paymentMethodType: payment_method_type,
          amount: amount || 0
        }, {
          onSuccess: (data) => {
            setPaymentMethods(data);
            setStep(3);
          },
          onError: (error) => {
            console.error('Error fetching payment methods:', error);
          }
        });
      }
    }
  };

  const handleInstructionsConfirm = () => {
    setShowInstructions(false);
    setStep(4);
  };

  return (
    <>
      <div className={styles.commonContainer}>
        <div className={styles.titleWrapper}>
          <Typography variant="h1" color="#fff" fontSize="26px" fontWeight="500">
            Способ оплаты
          </Typography>
          <div style={{ marginTop: '8px' }}>
            <Typography
              fontFamily='"Susse Int Book", sans-serif'
              variant="h1"
              color="#7C7F84"
              fontSize="16px"
              fontWeight="450"
            >
              Выберите способ оплаты
            </Typography>
          </div>
        </div>
        <div className={styles.paymentsContainer}>
          {availablePaymentMethods.map((method) => (
            <div
              key={method.id}
              className={`${styles.paymentMethod} ${selectedMethod === method.id ? styles.selected : ''}`}
              onClick={() => setSelectedMethod(method.id)}
            >
              <div className={styles.paymentContent}>
                <div className={styles.iconContainer}>
                  {Array.isArray(method.icon) ? (
                    <div className={styles.multipleIcons}>
                      {method.icon.length === 2 ? (
                        <div className={styles.twoIcons}>
                          {method.icon.map((icon, index) => (
                            <img key={index} src={icon} alt={`${method.title} icon ${index + 1}`} />
                          ))}
                        </div>
                      ) : (
                        <>
                          <img src={method.icon[0]} alt={`${method.title} icon 1`} />
                          <div className={styles.bottomRow}>
                            {method.icon.slice(1).map((icon, index) => (
                              <img key={index} src={icon} alt={`${method.title} icon ${index + 2}`} />
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    <img src={method.icon} alt={`${method.title} icon`} />
                  )}
                </div>
                <p style={{ fontFamily: '"Susse Int Book", sans-serif', color: '#fff', fontSize: '15px', fontWeight: '500' }}>{method.title}</p>
              </div>
              {method.additionalIcon && (
                <div className={method.type === 'qr' ? styles.qrIcon : styles.phoneIcon}>
                  <img src={method.additionalIcon} alt={`${method.type} icon`} />
                </div>
              )}
              {method.discount && (
                <div className={styles.discount}>
                  <Typography color="#228E5D" fontSize="14px" fontWeight="500">
                    {method.discount}
                  </Typography>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className={styles.buttonContainer}>
          <Button onClick={handleConfirm} disabled={!selectedMethod || isPending}>
            {isPending ? 'Загрузка...' : 'Подтвердить'}
          </Button>
        </div>
      </div>
      <PaymentInstructions
        isOpen={showInstructions}
        onClose={() => setShowInstructions(false)}
        onConfirm={handleInstructionsConfirm}
        type={selectedMethod && availablePaymentMethods.find(method => method.id === selectedMethod)?.type === 'qr' ? 'sbp' : 'card'}
        isOrderCreation={true}
      />
    </>
  )
}

export default PaymentType
