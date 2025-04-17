import { Typography } from '../../shared/ui/Typography'
import styles from '../../styles/Check.module.scss'
import Button from '../../shared/ui/button/Button'
import { useState, useCallback, useEffect } from 'react'
import FolderIcon from '../../shared/icons/FolderIcon'
import Success from '../../shared/icons/Success'
import CheckIcon from '../../shared/icons/CheckIcon'
import { useStepStore } from '../steps/models/store'
import { useOrderStore } from '../../shared/store/orderStore'
import { useSendDocument } from '../../shared/api/payment-hooks'
import { PAYMENT_STATUSES } from '../../shared/providers/socket-provider'
import { AxiosError } from 'axios'

const Check = () => {
  const [file, setFile] = useState<File | null>(null);
  const [minutes, setMinutes] = useState(15);
  const [seconds, setSeconds] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const { setStep } = useStepStore();
  const { orderData, updateOrderStatus } = useOrderStore();
  const { mutateAsync: sendDocument, isPending } = useSendDocument();

  useEffect(() => {
    const timer = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      } else if (minutes > 0) {
        setMinutes(minutes - 1);
        setSeconds(59);
      } else {
        clearInterval(timer);
        setStep(6);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [minutes, seconds, setStep]);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setUploadError(null);

    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      const droppedFile = event.dataTransfer.files[0];
      if (droppedFile.type.startsWith('image/') || droppedFile.type === 'application/pdf') {
        setFile(droppedFile);
      } else {
        setUploadError('Пожалуйста, загрузите изображение или PDF файл');
      }
    }
  }, []);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
      if (selectedFile.type.startsWith('image/') || selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
      } else {
        setUploadError('Пожалуйста, загрузите изображение или PDF файл');
      }
    }
  }, []);

  const handleClick = useCallback(() => {
    document.getElementById('file-upload')?.click();
  }, []);

  const handleSubmit = async () => {
    if (!file || !orderData || isUploading) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const response = await sendDocument({
        paymentId: orderData.payment_id,
        file
      });

      console.log('data', response);

      if (response?.data?.result) {
        setIsUploaded(true);
        updateOrderStatus(PAYMENT_STATUSES.WAIT_CONFIRM);

        setTimeout(() => {
          setStep(6);
        }, 100);
      } else {
        setUploadError(response?.data?.message || 'Ошибка при отправке документа');
      }
    } catch (error) {
      console.error('Error uploading document:', error);

      let errorMessage = 'Ошибка при загрузке документа. Пожалуйста, попробуйте еще раз.';

      if (error instanceof AxiosError && error.response) {
        const { status, data } = error.response;

        if (status === 422 && data.detail) {
          errorMessage = 'Ошибка валидации: ' + JSON.stringify(data.detail);
        } else if (data.message) {
          errorMessage = data.message;
        }

        console.error('Error response:', status, data);
      }

      setUploadError(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={styles.commonContainer}>
      <div className={styles.titleWrapper}>
        <Typography variant="h1" color="#fff" fontSize="26px" fontWeight="500">
          Прикрепите чек
        </Typography>
        <div style={{ marginTop: '8px' }}>
          <Typography
            fontFamily='"Susse Int Book", sans-serif'
            variant="h1"
            color="#7C7F84"
            fontSize="16px"
            fontWeight="450"
          >
            Приложите чек перевода средств
          </Typography>
        </div>
      </div>

      <div className={styles.dropzoneContainer}>
        <div
          className={styles.dropzone}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={handleClick}
        >
          <input
            type="file"
            id="file-upload"
            onChange={handleFileChange}
            style={{ display: 'none' }}
            accept="image/*, application/pdf"
          />

          {!file ? (
            <div className={styles.dropzoneContent}>
              <div className={styles.dropzoneIcon}>
                <FolderIcon />
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <Success />
            </div>
          )}
        </div>
      </div>

      {uploadError && (
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <Typography color="#F44336" fontSize="14px" fontWeight="450">
            {uploadError}
          </Typography>
        </div>
      )}

      {file && !uploadError && (
        <div style={{ textAlign: 'center', marginTop: '24px', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
          <Typography color="#228E5D" fontSize="16px" fontWeight="450">
            {isUploaded ? 'Чек отправлен' : `Файл: ${file.name}`}
          </Typography>
          {isUploaded && <CheckIcon />}
        </div>
      )}

      <div className={styles.buttonContainer}>
        <Button
          style={{ width: '100%' }}
          disabled={!file || isPending || isUploaded}
          onClick={handleSubmit}
        >
          {isPending ? 'Отправка...' : 'Отправить'}
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
            Осталось на отправку чека
          </Typography>
        </div>
      </div>
    </div>
  )
}

export default Check
