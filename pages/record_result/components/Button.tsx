import style from './Button.module.css'

interface ButtonProps {
  children?: React.ReactNode
  onClick?: () => void
}

export function ButtonBase (props: ButtonProps): React.ReactNode {
  return (
    <button
      className={style.primaryButton}
      onClick={props.onClick}
    >{props.children}
    </button>
  )
}
