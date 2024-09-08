import { useContext, useRef } from 'react'

import { DEFAULT_OPTIONS, setOption, type Option as OptionType, type OtherOptions } from '../../../types/options'
import style from './Option.module.css'
import { OptionContext } from './OptionView'

/**
 * Option component
 *
 * 옵션에 사용되는 기본 컴포넌트입니다.
 * 옵션 컴포넌트 안에는 OptionHeader, CheckButton, NumberInput 등이 포함될 수 있습니다.
 */
function Option ({ children }: { children: React.ReactNode }): React.ReactNode {
  return (
    <div className={style.option}>
      {children}
    </div>
  )
}

/**
 * Option Header component
 *
 * 옵션의 제목과 설명을 나타내는 컴포넌트입니다.
 */
function OptionHeader ({ title, desc }: { title: string, desc: string }): React.ReactNode {
  return (
    <div className={style.optionDescription}>
      <span className={style.title}>{title}</span>
      <span className={style.desc}>{desc}</span>
    </div>
  )
}

/**
 * CheckButton component
 *
 * 옵션의 체크박스를 나타내는 컴포넌트입니다.
 * 체크박스를 클릭하면 해당 옵션의 값을 변경하고, 변경된 값을 저장합니다. (Context API 사용)
 */
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

/**
 * NumberInput component
 *
 * 옵션의 숫자 입력창을 나타내는 컴포넌트입니다.
 * 입력창에 숫자를 입력하면 해당 옵션의 값을 변경하고, 변경된 값을 저장합니다. (Context API 사용)
 */
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
