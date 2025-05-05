import style from './Button.module.css'

interface ButtonProps {
  children?: React.ReactNode
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClick?: (e?: any) => void
}

export function ButtonBase (props: ButtonProps): React.ReactNode {
  return (
    <button
      className={style.primaryButton}
      onClick={(e) => {
        if (props.onClick !== undefined) {
          e.stopPropagation()
          props.onClick(e)
        }
      }}
    >{props.children}
    </button>
  )
}
