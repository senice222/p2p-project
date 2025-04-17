import io from 'socket.io-client';
import { useOrderStore } from '../store/orderStore';

export const SOCKET_PATH = 'https://market.vivaldi-development.online'

// Константы для статусов платежа
export const PAYMENT_STATUSES = {
  CREATED: 0,
  WAIT_DOCUMENT: 1,
  WAIT_CONFIRM: 2,
  CONFIRMED: 3,
  CANCELLED: 4,
  EXPIRED: 5,
  DECLINED: 6
};

interface StatusChangedData {
  payment_id: number;
  status: number;
}

// Класс для управления сокет-соединением
export class SocketManager {
  private socket: any = null;
  public currentPaymentId: string | null | number = null;
  // private currentPaymentId: number | null = null;

  // Метод для получения сокета (создает новый, если нужно)
  getSocket(): any {
    const { orderData } = useOrderStore.getState();
    const paymentId = orderData?.payment_id || null;
    console.log('Socket: Connecting for payment ID:', paymentId);

    // Если платеж изменился, создаем новый сокет
    // if (paymentId !== this.currentPaymentId) {
      console.log('Socket: Creating new connection for payment ID:', paymentId);

      // Закрываем предыдущее соединение если было
      if (this.socket) {
        console.log('Socket: Disconnecting previous socket');
        this.socket.disconnect();
      }

      // Создаем новый сокет
      this.socket = io(`${SOCKET_PATH}`, {
        path: '/market/payws/socket.io/',
        auth: {
          init_data: 'query_id=AAFrv58yAgAAAGu_nzJLsb9X&user=%7B%22id%22%3A5144297323%2C%22first_name%22%3A%22Vivaldi%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22VivaldiCode%22%2C%22language_code%22%3A%22ru%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2F3xwzdTJNpGT5xO9zPiWaqh_QXcs6Ri3EkTfm05cPPMPg09fKDwdrwh65VrtqARPa.svg%22%7D&auth_date=1744058699&signature=4VeRt08j1GI4uVgyvDVhYLu0xUgfrBvaJxGchAucFSJoefKISemnJSKwcUeYa-Fh2wQnUmSVT2H_kBMuzE94Aw&hash=86db3245082a15b9f82963caf07df65202aa866564d77fa6edd46027196695c4',
          payment_id: paymentId,
        },
        transports: ['websocket'],
      });

      console.log('Socket: New connection created');

      // Обновляем ID текущего платежа
      this.currentPaymentId = paymentId;

      // Добавляем обработчик события подключения
      this.socket.on('connect', () => {
        console.log('Socket: Connected successfully');
      });

      // Добавляем обработчик ошибок
      this.socket.on('connect_error', (error: any) => {
        console.error('Socket: Connection error:', error);
      });

      // Добавляем обработчик события изменения статуса
      this.socket.on('status_changed', (data: StatusChangedData) => {
        console.log('Socket: Payment status changed:', data);
        const { payment_id, status } = data;

        const { orderData, updateOrderStatus } = useOrderStore.getState();

        if (orderData && orderData.payment_id === payment_id) {
          console.log('Socket: Updating order status to', status);
          updateOrderStatus(status);

          // Если статус: подтвержден, отменен, истек срок или отклонен - очищаем localStorage после обновления UI
          const isFinalStatus = status >= PAYMENT_STATUSES.CONFIRMED; // 3, 4, 5, 6

          const event = new CustomEvent('payment_status_updated', {
            detail: {
              payment_id,
              status,
              isFinalStatus
            }
          });
          window.dispatchEvent(event);

        } else {
          console.log('Socket: Order data not matching or missing', { currentOrderId: orderData?.payment_id, receivedId: payment_id });
        }
      });
    // }

    return this.socket;
  }

  // Метод для отключения сокета
  disconnect() {
    console.log('Socket: Disconnecting');
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.currentPaymentId = null;
    }
  }
}

// Синглтон-экземпляр менеджера сокетов
export const socketManager = new SocketManager();
