import { type ReactNode, createContext, useContext, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

export interface ModalContextType {
  modals: ReactNode[]
  openModal: (modal: ReactNode) => void
  closeModal: () => void
}

export const ModalContext = createContext<ModalContextType>({
  modals: [],
  openModal: () => {},
  closeModal: () => {}
})

export function ModalProvider ({ children }: { children: ReactNode }): ReactNode {
  const [modals, setModals] = useState<ReactNode[]>([])

  const openModal = (modal: ReactNode): void => {
    setModals([...modals, modal])
  }

  const closeModal = (): void => {
    setModals(modals.slice(0, -1))
  }

  return (
    <ModalContext.Provider value={{ modals, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  )
}

export function useModal (): ModalContextType {
  return useContext(ModalContext)
}

export function Modal (): ReactNode {
  const { modals } = useModal()
  const rootRef = useRef<HTMLElement | null>(document.getElementById('modal-root'))

  return (rootRef.current != null) ? createPortal(modals, rootRef.current) : null
}
