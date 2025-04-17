import { Typography } from '../../shared/ui/Typography'
import styles from '../../styles/Finish.module.scss'
import Button from '../../shared/ui/button/Button'
import { useState, useRef, useEffect } from 'react'
import { useOrderStore } from '../../shared/store/orderStore'
import { PAYMENT_STATUSES, socketManager } from '../../shared/providers/socket-provider'
import { useSendReview } from '../../shared/api/payment-hooks'

const Finish = () => {
  const [review, setReview] = useState('')
  const [rating, setRating] = useState<'like' | 'dislike' | null>(null)
  const [reviewSent, setReviewSent] = useState(false)
  const [reviewError, setReviewError] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const { orderData, resetOrder } = useOrderStore()
  const { mutateAsync: sendReview, isPending: isSendingReview } = useSendReview()

  // Инициализируем сокет-соединение при загрузке компонента
  useEffect(() => {
    console.log('Finish: Initializing socket connection...');
    socketManager.getSocket();

    // При размонтировании компонента проверяем статус
    // Если статус финальный (≥ 3), очищаем localStorage
    return () => {
      // Получаем актуальные данные из хранилища при размонтировании
      const { orderData, resetOrder } = useOrderStore.getState();

      if (orderData && orderData.status >= PAYMENT_STATUSES.CONFIRMED) {
        console.log('Finish component unmounted with final status. Cleaning localStorage...');
        resetOrder();
      }
    };
  }, []);

  // Дополнительный эффект для очистки при финальных статусах
  useEffect(() => {
    // Если статус финальный (≥ 3), готовим очистку при закрытии/уходе
    if (orderData && orderData.status >= PAYMENT_STATUSES.CONFIRMED) {
      console.log('Final status detected in Finish component, will clean on unmount');

      // Добавляем обработчик для очистки при закрытии вкладки/окна
      const handleBeforeUnload = () => {
        console.log('Window unloading with final status. Cleaning localStorage...');
        resetOrder();
      };

      window.addEventListener('beforeunload', handleBeforeUnload);

      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
  }, [orderData?.status, resetOrder]);

  // Получаем статус платежа или используем статус CREATED по умолчанию
  const paymentStatus = orderData?.status ?? PAYMENT_STATUSES.CREATED

  // Определяем информацию для отображения в зависимости от статуса
  const getStatusInfo = () => {
    switch (paymentStatus) {
      case PAYMENT_STATUSES.CONFIRMED:
        return {
          title: 'Успешно!',
          subtitle: 'Ваш платеж подтвержден',
          statusText: 'Подтвержден',
          statusColor: '#00A76F',
          showReview: true
        }
      case PAYMENT_STATUSES.WAIT_CONFIRM:
        return {
          title: 'Отправлено!',
          subtitle: 'Ожидаем подтверждение от продавца',
          statusText: 'Ожидает подтверждения',
          statusColor: '#FFB547',
          showReview: false
        }
      case PAYMENT_STATUSES.WAIT_DOCUMENT:
        return {
          title: 'Ожидаем документ',
          subtitle: 'Загрузите подтверждение оплаты',
          statusText: 'Ожидает документ',
          statusColor: '#FFB547',
          showReview: false
        }
      case PAYMENT_STATUSES.CANCELLED:
        return {
          title: 'Отменено',
          subtitle: 'Платеж был отменен',
          statusText: 'Отменен',
          statusColor: '#F44336',
          showReview: false
        }
      case PAYMENT_STATUSES.EXPIRED:
        return {
          title: 'Истек срок',
          subtitle: 'Время ожидания платежа истекло',
          statusText: 'Истек срок',
          statusColor: '#F44336',
          showReview: false
        }
      case PAYMENT_STATUSES.DECLINED:
        return {
          title: 'Отклонено',
          subtitle: 'Платеж был отклонен',
          statusText: 'Отклонен',
          statusColor: '#F44336',
          showReview: false
        }
      default:
        return {
          title: 'В обработке',
          subtitle: 'Платеж находится в обработке',
          statusText: 'В обработке',
          statusColor: '#FFB547',
          showReview: false
        }
    }
  }

  const statusInfo = getStatusInfo()

  const handleSubmit = async () => {
    if (!rating || (rating === 'dislike' && !review) || !orderData?.payment_id) return;

    setReviewError(null);

    try {
      const booleanRating = rating === 'like';

      const payload: {
        paymentId: number;
        rating: boolean;
        review?: string;
      } = {
        paymentId: orderData.payment_id,
        rating: booleanRating
      };

      if (!booleanRating) {
        payload.review = review;
      }

      if (booleanRating) {
        setReview('');
      }

      await sendReview(payload);

      setReviewSent(true);
      setRating(null);
      setReview('');
    } catch (error) {
      console.error('Ошибка при отправке отзыва:', error);
      setReviewError('Ошибка при отправке отзыва. Пожалуйста, попробуйте еще раз.');
    }
  }

  return (
    <div className={styles.commonContainer} ref={containerRef}>
      <div className={styles.titleWrapper}>
        <Typography variant="h1" color="#fff" fontSize="26px" fontWeight="500">
          {statusInfo.title}
        </Typography>
        <div style={{ marginTop: '8px' }}>
          <Typography
            fontFamily='"Susse Int Book", sans-serif'
            variant="h1"
            color="#7C7F84"
            fontSize="16px"
            fontWeight="450"
          >
            {statusInfo.subtitle}
          </Typography>
        </div>
      </div>

      <div className={styles.orderInfoContainer}>
        <div className={styles.infoBlock}>
          <div className={styles.infoRow}>
            <Typography color="#7C7F84" fontSize="16px" fontWeight="450">
              Номер
            </Typography>
            <Typography color="#fff" fontSize="16px" fontWeight="450">
              #{orderData?.payment_id ?? '-'}
            </Typography>
          </div>

          <div className={styles.infoRow}>
            <Typography color="#7C7F84" fontSize="16px" fontWeight="450">
              Статус
            </Typography>
            <Typography color={statusInfo.statusColor} fontSize="16px" fontWeight="450">
              {statusInfo.statusText}
            </Typography>
          </div>

          {orderData && (
            <>
              <div className={styles.infoRow}>
                <Typography color="#7C7F84" fontSize="16px" fontWeight="450">
                  Сумма
                </Typography>
                <Typography color="#fff" fontSize="16px" fontWeight="450">
                  {orderData.amount_on_currency.toLocaleString()} {orderData.currency === 'rub' ? '₽' : orderData.currency.toUpperCase()}
                </Typography>
              </div>
            </>
          )}
        </div>
      </div>

      {statusInfo.showReview && !reviewSent && (
        <>
          <div className={styles.ratingSection}>
            <div style={{ marginBottom: '16px' }}>
              <Typography color="#fff" fontSize="16px" fontWeight="450" fontFamily='"Susse Int Book", sans-serif'>
                Поставьте оценку продавцу
              </Typography>
            </div>

            <div className={styles.ratingButtons}>
              <button
                className={`${styles.ratingButton} ${rating === 'like' ? styles.active : ''}`}
                onClick={() => setRating('like')}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V13C2 12.4696 2.21071 11.9609 2.58579 11.5858C2.96086 11.2107 3.46957 11 4 11H7M14 9V5C14 4.20435 13.6839 3.44129 13.1213 2.87868C12.5587 2.31607 11.7956 2 11 2L7 11V22H18.28C18.7623 22.0055 19.2304 21.8364 19.5979 21.524C19.9654 21.2116 20.2077 20.7769 20.28 20.3L21.66 11.3C21.7035 11.0134 21.6842 10.7207 21.6033 10.4423C21.5225 10.1638 21.3821 9.90629 21.1919 9.68751C21.0016 9.46873 20.7661 9.29393 20.5016 9.17522C20.2371 9.0565 19.9499 8.99672 19.66 9H14Z"
                    stroke={rating === 'like' ? '#00A76F' : '#424850'}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <button
                className={`${styles.ratingButton} ${rating === 'dislike' ? styles.active : ''}`}
                onClick={() => setRating('dislike')}
              >
                <svg
                  className={styles.flippedIcon}
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V13C2 12.4696 2.21071 11.9609 2.58579 11.5858C2.96086 11.2107 3.46957 11 4 11H7M14 9V5C14 4.20435 13.6839 3.44129 13.1213 2.87868C12.5587 2.31607 11.7956 2 11 2L7 11V22H18.28C18.7623 22.0055 19.2304 21.8364 19.5979 21.524C19.9654 21.2116 20.2077 20.7769 20.28 20.3L21.66 11.3C21.7035 11.0134 21.6842 10.7207 21.6033 10.4423C21.5225 10.1638 21.3821 9.90629 21.1919 9.68751C21.0016 9.46873 20.7661 9.29393 20.5016 9.17522C20.2371 9.0565 19.9499 8.99672 19.66 9H14Z"
                    stroke={rating === 'dislike' ? '#fff' : '#424850'}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Отображаем поле для отзыва только если выбран dislike */}
          {rating === 'dislike' && (
            <div className={styles.reviewSection}>
              <div style={{ marginBottom: '16px' }}>
                <Typography color="#fff" fontSize="16px" fontWeight="450" fontFamily='"Susse Int Book", sans-serif'>
                  Отзыв продавцу (обязательно)
                </Typography>
              </div>

              <textarea
                className={styles.reviewTextarea}
                placeholder="Опишите, что пошло не так"
                value={review}
                onChange={(e) => setReview(e.target.value)}
                ref={textareaRef}
              ></textarea>
            </div>
          )}

          {reviewError && (
            <div style={{ marginTop: '16px', textAlign: 'center' }}>
              <Typography color="#F44336" fontSize="14px" fontWeight="450">
                {reviewError}
              </Typography>
            </div>
          )}

          <div className={styles.buttonContainer}>
            <Button
              style={{ width: '100%' }}
              disabled={!rating || (rating === 'dislike' && !review) || isSendingReview}
              onClick={handleSubmit}
            >
              {isSendingReview ? 'Отправка...' : 'Отправить'}
            </Button>
          </div>
        </>
      )}

      {statusInfo.showReview && reviewSent && (
        <div style={{ marginTop: '24px', textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ marginBottom: '16px' }}>
            <Typography color="#00A76F" fontSize="18px" fontWeight="500">
              Спасибо за отзыв!
            </Typography>
          </div>
          <Typography color="#7C7F84" fontSize="16px" fontWeight="450">
            Ваш отзыв успешно отправлен
          </Typography>
        </div>
      )}

      {/* Для отрицательных статусов добавим кнопку "Вернуться в начало" */}
      {(paymentStatus === PAYMENT_STATUSES.CANCELLED ||
        paymentStatus === PAYMENT_STATUSES.EXPIRED ||
        paymentStatus === PAYMENT_STATUSES.DECLINED) && (
          <div className={styles.buttonContainer}>
            <Button
              style={{ width: '100%' }}
              onClick={() => window.location.reload()}
            >
              Вернуться в начало
            </Button>
          </div>
        )}

      <div className={styles.supportContainer}>
        <div className={styles.supportLink} onClick={() => {
          if (window?.Telegram?.WebApp?.openLink) {
            window.Telegram.WebApp.openLink('https://t.me/p2psupps_bot');
          } else {
            window.open('https://t.me/p2psupps_bot', '_blank');
          }
        }}>
          <div className={styles.supportIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V11H13V17ZM12 9C11.45 9 11 8.55 11 8C11 7.45 11.45 7 12 7C12.55 7 13 7.45 13 8C13 8.55 12.55 9 12 9Z" fill="#7C7F84" />
            </svg>
          </div>
          <Typography color="#7C7F84" fontSize="16px" fontWeight="450">
            Тех. поддержка
          </Typography>
          <Typography color="white" fontSize="16px" fontWeight="450" className={styles.supportUsername}>
            @p2psupps_bot
          </Typography>
        </div>
      </div>
    </div >
  )
}

export default Finish
