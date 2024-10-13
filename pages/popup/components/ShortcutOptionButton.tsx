import { useModal } from './Modal'
import style from './ResetButton.module.css'
import { ShortcutOptionModal } from './ShortcutOptionModal'

export function ShortcutOptionButton (): React.ReactNode {
  const { openModal, closeModal } = useModal()

  const onClick = (): void => {
    openModal(<ShortcutOptionModal closeModal={closeModal} />)
  }

  return (
    <button id={style.resetButton} onClick={onClick}>
      단축키 설정
    </button>
  )
}
