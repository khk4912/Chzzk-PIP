import React, { useEffect, useState } from 'react'
import { getKeyBindings, type KeyBindings, setKeyBindings } from '../../../types/options'
import style from './ShortcutOptionModal.module.css'
import { useModal } from './Modal'
import { koreanToEnglish } from '../../../utils/hooks'

const sanitizeKey = (key: string): string => {
  const isKorean = /[ㄱ-ㅎ|ㅏ-ㅣ]/.test(key)

  if (isKorean) {
    return koreanToEnglish[key as keyof typeof koreanToEnglish]
  }

  if (key.length === 1) {
    return key.toUpperCase()
  }

  return key
}

export function ShortcutOptionModal (): React.ReactNode {
  const { closeModal } = useModal()

  // Refresh when the option is changed

  return (
    <div className={style.modalWrapper} onClick={closeModal}>
      <div className={style.modalContent}>
        <ShortcutKey keyName='녹화' optionID='rec' />
        <ShortcutKey keyName='스크린샷' optionID='screenshot' />
        <ShortcutKey keyName='PIP' optionID='pip' />
      </div>
    </div>
  )
}

export function KeyPendingModal ({ optionID }: { optionID: keyof KeyBindings }): React.ReactNode {
  const { closeModal } = useModal()

  useEffect(() => {
    const listener = (e: KeyboardEvent): void => {
      setKeyBindings(optionID, sanitizeKey(e.key))
        .catch(console.error)
        .finally(() => { closeModal() })
    }

    document.addEventListener('keydown', listener, { once: true })

    return () => {
      document.removeEventListener('keydown', listener)
    }
  }, [optionID, closeModal])

  return (
    <div className={style.modalWrapper}>
      <div className={style.modalContent}>
        <div className={style.pendingMessage}>
          <span className={style.header}>새로운 키를 눌러주세요!</span>
          <span className={style.text}>치지직 기본 단축키와 중복되도록 설정할 경우, 충돌이 발생할 가능성이 있으니 주의하세요.</span>
        </div>
      </div>
    </div>
  )
}

function ShortcutKey ({ keyName, optionID }: { keyName: string, optionID: keyof KeyBindings }): React.ReactNode {
  const [key, setKey] = useState<string>('')

  useEffect(() => {
    getKeyBindings()
      .then(
        (keyBind) => {
          setKey(keyBind[optionID])
        })
      .catch(console.error)
  })

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

function ShortcutSetButton ({ optionID }: { optionID: keyof KeyBindings }): React.ReactNode {
  const { openModal } = useModal()
  const onClick = (): void => {
    openModal(<KeyPendingModal optionID={optionID} key={`${optionID}_pending`} />)
  }

  return (
    <button
      className={style.setButton} onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
    >
      설정
    </button>
  )
}
