import { Typography } from '../../shared/ui/Typography'
import styles from '../../styles/Amount.module.scss'
import Input from '../../shared/ui/input/Input'
import { useState } from 'react'
import { useStepStore } from '../steps/models/store'
import Button from '../../shared/ui/button/Button'
import { useGetPaymentMethodTypes } from '../../shared/api/payment-hooks'
import { useOrderStore } from '../../shared/store/orderStore'
import { AxiosError } from 'axios'
import ErrorModal from '../../components/ErrorModal'

// Интерфейс для ошибки "нет подходящих ордеров"
interface ApiErrorResponse {
  type: string;
  message: string;
  nearest?: {
    nearest_higher: number | null;
    nearest_lower: number | null;
  };
}

const Amount = () => {
  const [value, setValue] = useState('')
  const [errorModalOpen, setErrorModalOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState({ title: '', message: '' })
  const { setStep } = useStepStore()
  const { setPaymentMethodTypes, setAmount } = useOrderStore()
  const { mutateAsync: getPaymentMethodTypes, isPending } = useGetPaymentMethodTypes()

  const handleNewStep = () => {
    if (!value || isNaN(Number(value)) || Number(value) <= 0) {
      return
    }

    const amount = Number(value)
    setAmount(amount)

    getPaymentMethodTypes(amount, {
      onSuccess: (data) => {
        console.log('Payment methods:', data)
        setPaymentMethodTypes(data)
        setStep(2)
      },
      onError: (error: unknown) => {
        console.error('Error fetching payment methods:', error)

        // Проверяем, является ли ошибка от axios
        const axiosError = error as AxiosError<ApiErrorResponse>

        if (axiosError.response && axiosError.response.data) {
          const { type, message, nearest } = axiosError.response.data

          // Обрабатываем ошибку "Нет подходящих ордеров"
          if (type === 'order_not_found_error') {
            let errorText = message || 'Нет подходящих ордеров';

            // Если есть информация о ближайших ордерах, добавляем её в сообщение
            if (nearest) {
              const { nearest_lower, nearest_higher } = nearest;

              if (nearest_lower) {
                errorText += `. Ближайший ордер ниже: ${nearest_lower} ₽`;
              }

              if (nearest_higher) {
                errorText += `. Ближайший ордер выше: ${nearest_higher} ₽`;
              }
            }

            setErrorMessage({
              title: 'Ошибка!',
              message: errorText
            });
            setErrorModalOpen(true);
          } else {
            // Обрабатываем другие ошибки
            setErrorMessage({
              title: 'Ошибка!',
              message: message || 'Произошла ошибка при получении методов оплаты'
            });
            setErrorModalOpen(true);
          }
        } else {
          // Если нет данных об ошибке, показываем общее сообщение
          setErrorMessage({
            title: 'Ошибка!',
            message: 'Произошла ошибка при получении методов оплаты'
          });
          setErrorModalOpen(true);
        }
      }
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Разрешаем ввод только цифр, точки и запятой
    const newValue = e.target.value.replace(/[^\d.,]/g, '');

    // Заменяем запятую на точку для единообразия
    const normalizedValue = newValue.replace(',', '.');

    // Проверяем, что после точки не более двух цифр
    const parts = normalizedValue.split('.');
    if (parts.length > 2) {
      // Если больше одной точки, оставляем только первую
      const firstPart = parts[0];
      const secondPart = parts.slice(1).join('');
      setValue(`${firstPart}.${secondPart}`);
    } else if (parts.length === 2 && parts[1].length > 2) {
      // Если после точки больше двух цифр, обрезаем до двух
      setValue(`${parts[0]}.${parts[1].substring(0, 2)}`);
    } else {
      setValue(normalizedValue);
    }
  }

  return (
    <div className={styles.commonContainer}>
      <ErrorModal
        isOpen={errorModalOpen}
        title={errorMessage.title}
        message={errorMessage.message}
        onClose={() => setErrorModalOpen(false)}
      />
      <div className={styles.titleWrapper}>
        <Typography variant="h1" color="#fff" fontSize="26px" fontWeight="500">
          Сумма пополнения
        </Typography>
        <div style={{ marginTop: '8px' }}>
          <Typography
            fontFamily='"Susse Int Book", sans-serif'
            variant="h1"
            color="#7C7F84"
            fontSize="16px"
            fontWeight="450"
          >
            Введите сумму пополнения
          </Typography>
        </div>
      </div>
      <div className={styles.inputContainer}>
        <Input
          className={styles.input}
          value={value}
          onChange={handleChange}
          placeholder="100"
          typeOfIcon="rub"
        />
      </div>
      <div className={styles.buttonContainer}>
        <Button onClick={handleNewStep} disabled={isPending}>
          {isPending ? 'Загрузка...' : 'Подтвердить'}
        </Button>
      </div>
    </div>
  )
}

export default Amount
