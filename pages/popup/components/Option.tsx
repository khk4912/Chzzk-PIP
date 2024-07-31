import { useContext } from 'react'
import style from './Option.module.css'
import { DEFAULT_OPTIONS, setOption, type Option as OptionType } from '../../../types/options'
import { OptionContext } from './OptionView'

function Option ({ children }: { children: React.ReactNode }): React.ReactNode {
  return (
    <div className={style.option}>
      {children}
    </div>
  )
}

function OptionHeader ({ title, desc }: { title: string, desc: string }): React.ReactNode {
  return (
    <div className={style.optionDescription}>
      <span className={style.title}>{title}</span>
      <span className={style.desc}>{desc}</span>
    </div>
  )
}

function CheckButton ({ optionID }: { optionID: keyof OptionType }): React.ReactNode {
  const [optionContext, setOptionContext] = useContext(OptionContext)

  const handleClick = (): void => {
    setOptionContext((prev) => {
      const next = { ...prev }
      next[optionID] = !(next[optionID] ?? false)
      return next
    })

    void setOption(optionID, !(optionContext[optionID] ?? false)).catch(console.error)
  }

  return (
    <input
      onClick={handleClick}
      className={style.checkBox} role='switch' type='checkbox' checked={optionContext[optionID] ?? DEFAULT_OPTIONS[optionID]}
    />
  )
}

Option.Header = OptionHeader
Option.CheckButton = CheckButton

export default Option
