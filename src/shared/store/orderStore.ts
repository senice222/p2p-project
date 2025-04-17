import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Типы для данных о способах оплаты
export interface PaymentMethodType {
  payment_method_type: string;
  need_select_bank: boolean;
  max_discount_percent: number;
}

// Интерфейс для банка
export interface Bank {
  id: number;
  name: string;
  max_discount_percent: number;
}

// Интерфейс для пользователя
export interface User {
  username: string;
  username_html?: string;
  user_id: number;
  user_message_count: number;
  user_is_verified: boolean;
  user_is_banned?: number;
  links: {
    permalink: string;
    avatar: string;
  }
}

// Интерфейс для данных о заказе
export interface OrderData {
  order_id: number;
  payment_id: number;
  status: number;
  payment_method_type: string;
  requisites: string;
  currency: string;
  amount_on_currency: number;
  owner_security_deposit: number;
}

// Интерфейс для состояния заказа
interface OrderState {
  // Данные о способах оплаты
  paymentMethodTypes: PaymentMethodType[] | null;
  // Выбранный способ оплаты
  selectedPaymentMethod: PaymentMethodType | null;
  // Полученные методы оплаты
  paymentMethods: Bank[] | null;
  // Выбранный банк
  selectedBank: Bank | null;
  // Данные пользователя
  user: User | null;
  // Сумма заказа
  amount: number | null;
  // Данные о созданном заказе
  orderData: OrderData | null;
  // Методы для обновления состояния
  setPaymentMethodTypes: (types: PaymentMethodType[]) => void;
  setSelectedPaymentMethod: (method: PaymentMethodType) => void;
  setPaymentMethods: (methods: Bank[]) => void;
  setSelectedBank: (bank: Bank) => void;
  setUser: (user: User) => void;
  setAmount: (amount: number) => void;
  setOrderData: (data: OrderData) => void;
  // Обновление статуса заказа
  updateOrderStatus: (status: number) => void;
  // Метод для сброса состояния
  resetOrder: () => void;
}

// Создаем store с персистентностью
export const useOrderStore = create<OrderState>()(
  persist(
    (set) => ({
      // Начальное состояние
      paymentMethodTypes: null,
      selectedPaymentMethod: null,
      paymentMethods: null,
      selectedBank: null,
      user: null,
      amount: null,
      orderData: null,

      // Методы для обновления состояния
      setPaymentMethodTypes: (types) => set({ paymentMethodTypes: types }),
      setSelectedPaymentMethod: (method) => set({ selectedPaymentMethod: method }),
      setPaymentMethods: (methods) => set({ paymentMethods: methods }),
      setSelectedBank: (bank) => set({ selectedBank: bank }),
      setUser: (user) => set({ user }),
      setAmount: (amount) => set({ amount }),
      setOrderData: (data) => set({ orderData: data }),

      // Обновление статуса заказа
      updateOrderStatus: (status) => set((state) => ({
        orderData: state.orderData ? { ...state.orderData, status } : null
      })),

      // Метод для сброса состояния
      resetOrder: () => set({
        paymentMethodTypes: null,
        selectedPaymentMethod: null,
        paymentMethods: null,
        selectedBank: null,
        user: null,
        amount: null,
        orderData: null
      }),
    }),
    {
      name: 'order-storage', // Уникальное имя для localStorage
      storage: createJSONStorage(() => localStorage), // Используем localStorage
      partialize: (state) => ({
        // Сохраняем только нужные поля в localStorage
        orderData: state.orderData,
        user: state.user,
        selectedPaymentMethod: state.selectedPaymentMethod,
      }),
    }
  )
);
