import './ModalBase.css'

export function ModalBase ({ children, modalState }: { children: React.ReactNode, modalState: (x: boolean) => void }): React.ReactNode {
  return (
    <div className='modal'>
      <div
        className='modal-content'
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
        }}
      >
        {children}
      </div>
    </div>
  )
}
