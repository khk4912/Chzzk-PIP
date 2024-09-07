import { useContext, useRef } from 'react'

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
      checked={optionContext[optionID] ?? DEFAULT_OPTIONS[optionID]}
    />
  )
}

function NumberInput ({ optionID, max, min }: { optionID: keyof OtherOptions, max?: number, min?: number }): React.ReactNode {
  const [optionContext, setOptionContext] = useContext(OptionContext)
  const option = optionContext[optionID]

  const input = useRef<HTMLInputElement>(null)

  const onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setOptionContext((prev) => {
      const next = { ...prev }
      let newValue = Number(e.target.value)

      if (Number.isNaN(newValue)) {
        newValue = DEFAULT_OPTIONS[optionID]
      }

      if (typeof next[optionID] !== 'number') {
        return next
      }

      if (max !== undefined && newValue > max) {
        newValue = max
      }

      if (min !== undefined && newValue < min) {
        newValue = min
      }

      next[optionID] = newValue

      if (input.current !== null) {
        input.current.value = String(next[optionID])
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
      ref={input}
      onChange={onChange}
      className={style.numberInput}
      value={optionContext[optionID] ?? DEFAULT_OPTIONS[optionID]}
      type='number'
    />
  )
}

Option.Header = OptionHeader
Option.CheckButton = CheckButton
Option.NumberInput = NumberInput

export default Option
