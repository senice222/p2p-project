import { Typography } from '../../shared/ui/Typography'
import styles from '../../styles/Invoice.module.scss'
import Button from '../../shared/ui/button/Button'
import { useState, useEffect, useRef } from 'react'
import VerifiedIcon from '../../shared/icons/Verified'
import { useStepStore } from '../steps/models/store'
import CopyIcon from '../../shared/icons/CopyIcon'
import { useOrderStore } from '../../shared/store/orderStore'
import { useSetNewStatus } from '../../shared/api/payment-hooks'
import { PAYMENT_STATUSES  } from '../../shared/providers/socket-provider'
import QRCodeStyling from 'qr-code-styling'
import lztQr from '../../assets/lzt-qr.svg'
import QrIcon from '../../shared/icons/QrIcon'

const Invoice = () => {
  const [minutes, setMinutes] = useState(15)
  const [seconds, setSeconds] = useState(0)
  const { setStep } = useStepStore()
  const { orderData, user, selectedPaymentMethod, updateOrderStatus, resetOrder } = useOrderStore()
  const { mutateAsync: setNewStatus } = useSetNewStatus()
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1)
      } else if (minutes > 0) {
        setMinutes(minutes - 1)
        setSeconds(59)
      } else {
        clearInterval(timer);
        setStep(6);
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [minutes, seconds, setStep])

  useEffect(() => {
    if (orderData?.requisites && qrRef.current) {
      qrRef.current.innerHTML = '';

      const qrCode = new QRCodeStyling({
        width: 160,
        height: 160,
        type: "svg",
        data: orderData.requisites,
        image: lztQr,
        dotsOptions: {
          color: "#E3E7E3",
          type: "rounded"
        },
        backgroundOptions: {
          color: "#171B1E",
        },
        imageOptions: {
          crossOrigin: "anonymous",
          margin: 5,
          imageSize: 0.3
        },
        cornersSquareOptions: {
          color: "#E3E7E3",
          type: "extra-rounded"
        },
        cornersDotOptions: {
          color: "#E3E7E3",
          type: "dot"
        },
      });

      qrCode.append(qrRef.current);
    }
  }, [orderData?.requisites]);

  if (!orderData || !user) {
    return (
      <div className={styles.commonContainer}>
        <Typography variant="h1" color="#fff" fontSize="26px" fontWeight="500">
          Загрузка информации о платеже...
        </Typography>
      </div>
    )
  }

  const isQrPayment = orderData.payment_method_type === 'qr' || orderData.payment_method_type === 'qr_rub';

  const getCardTypeAndBank = () => {
    const paymentType = orderData.payment_method_type;
    const currency = orderData.currency?.toLowerCase();

    if (paymentType === 'card_rub') {
      return { type: 'card_rub', bank: 'Сбербанк' };
    } else if (paymentType === 'card_uah') {
      return { type: 'card_uah', bank: 'ПриватБанк' };
    }
    else if (paymentType === 'card') {
      if (currency === 'rub') {
        return { type: 'card', bank: 'Сбербанк' };
      } else if (currency === 'uah') {
        return { type: 'card', bank: 'ПриватБанк' };
      } else {
        return { type: 'card', bank: 'Банк' };
      }
    }

    // default
    return { type: paymentType, bank: '' };
  };

  const cardInfo = getCardTypeAndBank();

  const handleCopyRequisites = () => {
    if (orderData.requisites) {
      navigator.clipboard.writeText(orderData.requisites)
    }
  }

  const formatCurrency = (value: number, currency: string) => {
    return `${value.toLocaleString('ru-RU')} ${currency === 'rub' ? '₽' : currency.toUpperCase()}`
  }

  return (
    <div className={styles.commonContainer}>
      <div className={styles.titleWrapper}>
        <Typography variant="h1" color="#fff" fontSize="26px" fontWeight="500">
          Информация о платеже
        </Typography>
        <div style={{ marginTop: '8px' }}>
          <Typography
            fontFamily='"Susse Int Book", sans-serif'
            variant="h1"
            color="#7C7F84"
            fontSize="16px"
            fontWeight="450"
          >
            Подробности вашего пополнения
          </Typography>
        </div>
      </div>

      <div className={styles.paymentInfoContainer}>
        {/* Первый блок: информация о платеже */}
        <div className={styles.infoBlock}>
          <div className={styles.infoRow}>
            <Typography color="#7C7F84" fontSize="16px" fontWeight="450">
              Номер
            </Typography>
            <Typography color="#fff" fontSize="16px" fontFamily='"Susse Int Book", sans-serif' fontWeight="450">
              #{orderData.payment_id}
            </Typography>
          </div>

          <div className={`${styles.infoRow} ${styles.nicknameRow}`}>
            <div className={styles.nicknameBackground}></div>
            <Typography color="#7C7F84" fontSize="16px" fontWeight="450" fontFamily='"Susse Int Book", sans-serif'>
              Никнейм
            </Typography>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Typography color="#fff" fontSize="16px" fontFamily='"Susse Int Book", sans-serif' fontWeight="450">
                {user.username}
              </Typography>
              {user.user_is_verified && <span className={styles.verifiedIcon}><VerifiedIcon /></span>}
            </div>
          </div>

          <div className={styles.infoRow}>
            <Typography color="#7C7F84" fontSize="16px" fontWeight="450">
              Страховой депозит
            </Typography>
            <Typography color="#228E5D" fontSize="16px" fontWeight="450">
              {orderData.owner_security_deposit > 0
                ? formatCurrency(orderData.owner_security_deposit, orderData.currency)
                : 'Не требуется'}
            </Typography>
          </div>

          <div className={`${styles.infoRow} ${styles.rateRow}`}>
            <div className={styles.rateBackground}></div>
            <div className={styles.rateBorder}></div>
            <Typography color="#7C7F84" fontSize="16px" fontWeight="450">
              Курс
            </Typography>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Typography color="#fff" fontSize="16px" fontFamily='"Susse Int Book", sans-serif' fontWeight="450">
                {selectedPaymentMethod?.max_discount_percent !== undefined ? `${(1 - selectedPaymentMethod.max_discount_percent / 100).toFixed(2)}` : '1.00'}
              </Typography>
              {selectedPaymentMethod?.max_discount_percent !== undefined && selectedPaymentMethod.max_discount_percent > 0 && (
                <div className={styles.discountWrapper}>
                  Выгодно
                </div>
              )}
            </div>
          </div>

          <div className={styles.infoRow}>
            <Typography color="#7C7F84" fontSize="16px" fontWeight="450">
              Сумма
            </Typography>
            <Typography color="#fff" fontSize="16px" fontFamily='"Susse Int Book", sans-serif' fontWeight="450">
              {formatCurrency(orderData.amount_on_currency, orderData.currency)}
            </Typography>
          </div>
        </div>

        <div className={styles.infoBlock}>
          {isQrPayment ? (
            <div className={styles.qrCodeContainer} onClick={() => window.open(orderData.requisites, '_blank')}>
              <div className={styles.qrCode} ref={qrRef}>
                {/* QR */}
              </div>
              <div className={styles.qrFooter}>
                <Typography color="#fff" fontSize="18px" fontWeight="500">
                  Оплатить с телефона
                </Typography>
                <button className={styles.fullscreenButton}>
                  <QrIcon />
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className={styles.infoRow}>
                <Typography color="#7C7F84" fontSize="16px" fontWeight="450">
                  Реквизиты
                </Typography>
                <div className={styles.requisites}>
                  <Typography color="#fff" fontSize="16px" fontFamily='"Susse Int Book", sans-serif' fontWeight="450">
                    {orderData.requisites}
                  </Typography>
                  <button className={styles.copyButton} onClick={handleCopyRequisites}>
                    <CopyIcon />
                  </button>
                </div>
              </div>

              <div className={styles.infoRow}>
                <Typography color="#7C7F84" fontSize="16px" fontWeight="450">
                  Банк
                </Typography>
                <div className={styles.discountWrapper} style={{ color: '#228E5D', fontSize: '14px', fontWeight: '500' }}>
                  {cardInfo.bank}
                </div>
              </div>
            </>
          )}
        </div>

        <div className={styles.buttonContainer}>
          <Button
            style={{
              width: '50%',
            }}
            onClick={() => {
              setNewStatus({
                payment_id: orderData.payment_id,
                status: true,
              }).then(() => {
                updateOrderStatus(PAYMENT_STATUSES.WAIT_DOCUMENT);
                setStep(5);
              })
            }}
          >
            Я оплатил
          </Button>
          <Button
            className={styles.cancelButton}
            style={{
              width: '50%',
              backgroundColor: '#001F14'
            }}
            onClick={() => {
              setNewStatus({
                payment_id: orderData.payment_id,
                status: false,
              }).then(() => {
                resetOrder();
                setStep(0);
              })
            }}
          >
            Отменить
          </Button>
        </div>

        <div className={styles.timerContainer}>
          <div className={styles.timer}>
            <div className={styles.timerBox}>{minutes.toString().padStart(2, '0')}</div>
            <span className={styles.timerSeparator}>:</span>
            <div className={styles.timerBox}>{seconds.toString().padStart(2, '0')}</div>
          </div>
          <div className={styles.timerLabel}>
            <Typography color="#7C7F84" fontSize="16px" fontWeight="450">
              Осталось на оплату
            </Typography>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Invoice
