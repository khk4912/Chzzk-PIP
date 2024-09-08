import { createContext, useEffect, useState } from 'react'
import style from './OptionView.module.css'
import { type Option as OptionType, DEFAULT_OPTIONS, getOption } from '../../../types/options'

type Context<T> = [T, React.Dispatch<React.SetStateAction<T>>]
export const OptionContext = createContext < Context < OptionType>>([DEFAULT_OPTIONS, () => {}])

/**
 * OptionView component
 *
 * OptionContext의 Provider를 제공하는 컴포넌트입니다.
 */
export function OptionView ({ children }: { children: React.ReactNode }): React.ReactNode {
  const [contextValue, setContextValue] = useState<OptionType>(DEFAULT_OPTIONS)

  useEffect(() => {
    getOption().then(setContextValue).catch(console.error)
  }, [])

  return (
    <OptionContext.Provider value={[contextValue, setContextValue]}>
      <div className={style.optionView}>
        {children}
      </div>
    </OptionContext.Provider>
  )
}
