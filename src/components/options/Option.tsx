import { useContext, useRef, type Dispatch, type SetStateAction } from 'react'

import { DEFAULT_OPTIONS, setOption, type Option as OptionType, type OtherOptions } from '@/types/options'
import style from './Option.module.css'
import { OptionContext } from './OptionView'

// Helper function to update option value
async function updateOptionValue<T extends keyof OptionType>(
  optionID: T,
  newValue: OptionType[T],
  setOptionContext: Dispatch<SetStateAction<OptionType>>
): Promise<void> {
  setOptionContext((prev) => {
    const next = { ...prev }
    next[optionID] = newValue
    return next
  })

  try {
    await setOption(optionID, newValue)
  } catch (error) {
    console.error(error)
  }
}

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
    const currentValue = optionContext[optionID] ?? DEFAULT_OPTIONS[optionID]
    if (typeof currentValue === 'boolean') {
      void updateOptionValue(optionID, !currentValue, setOptionContext)
    }
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
    let newValue = Number(e.target.value)

    if (Number.isNaN(newValue)) {
      newValue = DEFAULT_OPTIONS[optionID] as number
    }

    if (typeof optionContext[optionID] !== 'number') {
      return
    }

    if (max !== undefined && newValue > max) {
      newValue = max
    }

    if (min !== undefined && newValue < min) {
      newValue = min
    }

    // Update input field immediately for responsiveness
    if (input.current !== null) {
      input.current.value = String(newValue)
    }

    void updateOptionValue(optionID, newValue, setOptionContext)
  }

  if (typeof option !== 'number') {
    return <></>
  }

  return (
    <input
      ref={input}
      onChange={onChange}
      className={style.numberInput}
      defaultValue={optionContext[optionID] ?? DEFAULT_OPTIONS[optionID]} // Use defaultValue for better UX with controlled input by helper
      type='number'
    />
  )
}

Option.Header = OptionHeader
Option.CheckButton = CheckButton
Option.NumberInput = NumberInput

export default Option
