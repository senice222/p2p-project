import { create } from 'zustand'

type ModalTypes = 'paymentInstructions' | 'confirmation' | 'error'

interface ModalProps {
  title?: string
  message?: string
  onConfirm?: () => void
  [key: string]: unknown
}

interface ModalStore {
  isOpen: boolean
  modalType: ModalTypes | null
  modalProps: ModalProps
  openModal: (type: ModalTypes, props?: ModalProps) => void
  closeModal: () => void
}

export const useModalSearchStore = create<ModalStore>((set) => ({
  isOpen: false,
  modalType: null,
  modalProps: {},

  openModal: () => {
    set({
      isOpen: true,
      // modalType: type,
      // modalProps: props,
    })
  },

  closeModal: () => {
    set({
      isOpen: false,
      // modalType: null,
      // modalProps: {},
    })
  },
}))
