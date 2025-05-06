import { useModal } from '@/components/ui/Modal'
import style from './ResetButton.module.css'
import { ShortcutOptionModal } from './ShortcutOptionModal'

export function ShortcutOptionButton (): React.ReactNode {
  const { openModal } = useModal()

  const onClick = (): void => {
    openModal(<ShortcutOptionModal key={0} />)
  }

  return (
    <button id={style.resetButton} onClick={onClick}>
      단축키 설정
    </button>
  )
}
