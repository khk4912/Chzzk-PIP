import React, { useEffect, useState } from 'react'
import { getOption, setOption, type DEFAULT_OPTIONS } from '../../../types/options'
import style from './ShortcutOptionModal.module.css'
import { get } from 'http'

export function ShortcutOptionModal ({ closeModal }: { closeModal: () => void }): React.ReactNode {
  return (
    <div className={style.modalWrapper} onClick={closeModal}>
      <div className={style.modalContent}>
        <ShortcutKey keyName='녹화' optionID='rec' />
        <ShortcutKey keyName='스크린샷' optionID='screenshot' />
      </div>
    </div>
  )
}

function ShortcutKey ({ keyName, optionID }: { keyName: string, optionID: keyof typeof DEFAULT_OPTIONS['keyBind'] }): React.ReactNode {
  const [key, setKey] = useState<string>('')

  useEffect(() => {
    void (async () => {
      const { keyBind } = await getOption()

      setKey(keyBind[optionID])
    })()
  }, [])

  return (
    <div className={style.shortcutItem} onClick={(e) => { e.stopPropagation() }}>
      <div className={style.shortcutHeader}>
        <span className={style.shortcutKeyName}>{keyName}</span>
        <span className={style.shortcutNowKey}>현재 설정 - {key}</span>
      </div>
      <ShortcutSetButton optionID={optionID} />
    </div>
  )
}

function ShortcutSetButton ({ optionID }: { optionID: keyof typeof DEFAULT_OPTIONS['keyBind'] }): React.ReactNode {
  // ASYNC
  const onClick = (): void => {
    document.addEventListener('keydown', (e) => {
      const key = e.key
      void (async () => {
        const { keyBind } = await getOption()

        keyBind[optionID] = key
        await setOption('keyBind', keyBind)
      })()
    }, { once: true })
  }

  return (
    <button className={style.setButton} onClick={onClick}>변경</button>
  )
}
