import { type ReactNode, createContext } from 'react' // Removed useContext, useRef, useState
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
  // Initialize ref directly. Assumes 'modal-root' exists or will exist when this component is used.
  const rootRef = useRef(document.getElementById('modal-root') as HTMLElement | null)

  return (rootRef.current != null) ? createPortal(modals, rootRef.current) : null
}
