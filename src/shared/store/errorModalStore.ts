import { create } from 'zustand';

// Типы ошибок, которые могут отображаться в модальном окне
export type ErrorType = 'too_many_active_payments' | 'general_error';

// Интерфейс состояния модального окна ошибок
interface ErrorModalState {
  isOpen: boolean;
  errorType: ErrorType | null;
  errorMessage: string;
  openModal: (errorType: ErrorType, errorMessage: string) => void;
  closeModal: () => void;
}

// Создаем store для модального окна ошибок
export const useErrorModalStore = create<ErrorModalState>((set) => ({
  isOpen: false,
  errorType: null,
  errorMessage: '',

  // Открыть модальное окно и установить тип ошибки и сообщение
  openModal: (errorType, errorMessage) => set({
    isOpen: true,
    errorType,
    errorMessage
  }),

  // Закрыть модальное окно
  closeModal: () => set({
    isOpen: false
  }),
}));
