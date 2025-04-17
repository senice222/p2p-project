import { Typography } from '../../shared/ui/Typography'
import styles from '../../styles/ChooseModal.module.scss'
import { useStepStore } from '../steps/models/store'
import Button from '../../shared/ui/button/Button'
import { useState, useEffect } from 'react'
import { useOrderStore } from '../../shared/store/orderStore'
import { useCreateOrder } from '../../shared/api/payment-hooks'
import { useErrorModalStore } from '../../shared/store/errorModalStore'
import { AxiosError } from 'axios'
import PaymentInstructions from '../../components/PaymentInstructions'

// Интерфейс для структуры ошибки от API
export interface ApiErrorResponse {
  type: string;
  message: string;
}

const ChooseBank = () => {
  const { setStep } = useStepStore()
  const { paymentMethods, setSelectedBank, amount, user, setOrderData, selectedPaymentMethod } = useOrderStore()
  const [selectedBankId, setSelectedBankId] = useState<number | null>(null)
  const [showInstructions, setShowInstructions] = useState(false)
  const { mutateAsync: createOrder, isPending } = useCreateOrder()
  const { openModal: openErrorModal } = useErrorModalStore()
  const isSingleBank = paymentMethods?.length === 1;

  useEffect(() => {
    if (!paymentMethods || paymentMethods.length === 0) {
      setStep(4)
    }
  }, [paymentMethods, setStep])

  const handleConfirm = () => {
    if (selectedBankId === null || !paymentMethods) return

    const selectedBank = paymentMethods.find(bank => bank.id === selectedBankId)
    if (selectedBank) {
      setSelectedBank(selectedBank)

      // Сначала создаем заказ, без показа инструкции
      if (!amount || !user) return;

      createOrder({
        amount,
        payment_method_id: selectedBank.id,
        lolz_user_id: user.user_id
      }, {
        onSuccess: (data) => {
          setOrderData(data)
          // Проверяем, нужно ли показывать инструкцию только после успешного создания заказа
          const hideInstructions = localStorage.getItem('hideOrderCreationInstructions') === 'true';
          if (hideInstructions) {
            // Если инструкция отключена, сразу переходим к следующему шагу
            setStep(4);
          } else {
            // Если инструкция включена, показываем её
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
      })
    }
  }

  const handleInstructionsConfirm = () => {
    setShowInstructions(false)
    setStep(4);
  }

  return (
    <>
      <div className={styles.commonContainer}>
        <div className={styles.titleWrapper}>
          <Typography variant="h1" color="#fff" fontSize="26px" fontWeight="500">
            Выберите банк
          </Typography>
          <div style={{ marginTop: '8px' }}>
            <Typography
              fontFamily='"Susse Int Book", sans-serif'
              variant="h1"
              color="#7C7F84"
              fontSize="16px"
              fontWeight="450"
            >
              Выберите банк для оплаты
            </Typography>
          </div>
        </div>
        <div className={styles.banksContainer}>
          {paymentMethods?.map((bank) => (
            <div
              key={bank.id}
              className={`
              ${styles.bankOption}
              ${selectedBankId === bank.id ? styles.selected : ''}
              ${isSingleBank ? styles.singleBank : ''}
            `}
              onClick={() => setSelectedBankId(bank.id)}
            >
              <div className={styles.bankName}>
                <Typography color="#fff" fontFamily='"Susse Int SemiBold", sans-serif' fontSize="16px" fontWeight="400">
                  {bank.name}
                </Typography>
                {bank.max_discount_percent > 0 && (
                  <div className={styles.discountWrapper}>
                    <Typography color="#228E5D" fontFamily='"Susse Int", sans-serif' fontSize="14px" fontWeight="500">
                      -{bank.max_discount_percent}%
                    </Typography>
                  </div>
                )}
              </div>
              <div
                className={`${styles.radioButton} ${selectedBankId === bank.id ? styles.selected : ''}`}
              />
            </div>
          ))}
        </div>
        <div className={styles.buttonContainer}>
          <Button onClick={handleConfirm} disabled={!selectedBankId || isPending}>
            {isPending ? 'Загрузка...' : 'Подтвердить'}
          </Button>
        </div>
      </div>
      <PaymentInstructions
        isOpen={showInstructions}
        onClose={() => setShowInstructions(false)}
        onConfirm={handleInstructionsConfirm}
        type={selectedPaymentMethod?.payment_method_type === 'qr_rub' || selectedPaymentMethod?.payment_method_type === 'phone_rub' ? 'sbp' : 'card'}
        isOrderCreation={true}
      />
    </>
  )
}

export default ChooseBank
