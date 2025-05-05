import './ModalBase.css'

export function ModalBase ({ children }: { children: React.ReactNode }): React.ReactNode {
  return (
    <div className='modal'>
      <div className='modal-content'>
        {children}
      </div>
    </div>
  )
}
