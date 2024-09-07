import { useContext } from 'react'

import { DEFAULT_OPTIONS, setOption, type Option as OptionType, type OtherOptions } from '../../../types/options'
import style from './Option.module.css'
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

function CheckButton ({ optionID }: { optionID: Exclude<keyof OptionType, keyof OtherOptions> }): React.ReactNode {
  const [optionContext, setOptionContext] = useContext(OptionContext)
  const option = optionContext[optionID]

  if (typeof option !== 'boolean') {
    return <></>
  }

  const handleClick = (): void => {
    setOptionContext((prev) => {
      const next = { ...prev }

      if (typeof next[optionID] === 'boolean') {
        next[optionID] = !next[optionID]
      }

      return next
    })

    void setOption(optionID, !(optionContext[optionID] ?? false)).catch(console.error)
  }

  return (
    <input
      onChange={handleClick}
      className={style.checkBox} role='switch' type='checkbox'
      checked={optionContext[optionID] ?? DEFAULT_OPTIONS[optionID] ?? false}
    />
  )
}

function NumberInput ({ optionID }: { optionID: keyof OtherOptions }): React.ReactNode {
  const [optionContext, setOptionContext] = useContext(OptionContext)
  const option = optionContext[optionID]

  const onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setOptionContext((prev) => {
      const next = { ...prev }

      const newValue = Number(e.target.value)
      if (Number.isNaN(newValue)) {
        next[optionID] = DEFAULT_OPTIONS[optionID]
      }

      if (typeof next[optionID] === 'number') {
        next[optionID] = newValue
      }

      return next
    })

    void setOption(optionID, Number(e.target.value)).catch(console.error)
  }

  if (typeof option !== 'number') {
    return <></>
  }

  return (
    <input
      onChange={onChange}
      className={style.numberInput}
      defaultValue={optionContext[optionID] ?? DEFAULT_OPTIONS[optionID]}
      type='number'
    />
  )
}

Option.Header = OptionHeader
Option.CheckButton = CheckButton
Option.NumberInput = NumberInput

export default Option
