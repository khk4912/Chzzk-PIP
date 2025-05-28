import { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import RecIcon from '@/assets/static/rec.svg?react'

import { RecordOverlayPortal } from './RecOverlay'
import { getKeyBindings } from '@/types/options'

export function RecordPortal (): React.ReactNode {
  const target = usePortal({
    id: 'chzzk-record-portal',
    targetSelector: '.pzp-pc__bottom-buttons-right',
    position: 'prepend',
  })

  return (
    <RecordPortalContainer target={target}>
      <RecordButton />
    </RecordPortalContainer>
  )
}

function RecordPortalContainer ({ target, children }: { target: Element | null, children: React.ReactNode }) {
  return target ? ReactDOM.createPortal(children, target) : null
}

/**
 * RecordButton component
 *
 * 녹화 버튼 컴포넌트입니다.
 */
function RecordButton (): React.ReactNode {
  const { isRecording, clickHandler } = useRecord()

  const [key, setKey] = useState<string>('')

  useEffect(() => {
    getKeyBindings()
      .then((k) => { setKey(k.rec) })
      .catch(console.error)
  }, [])

  useShortcut(key, () => { clickHandler().catch(console.error) })

  return (
    <>
      <button
        className='pzp-button pzp-pc-setting-button pzp-pc__setting-button pzp-pc-ui-button chzzk-record-button'
        onClick={() => { clickHandler().catch(console.error) }}
      >
        <span className='pzp-button__tooltip pzp-button__tooltip--top'>
          {isRecording ? '녹화 중지' : '녹화'} ({key})
        </span>
        <span className='pzp-ui-icon pzp-pc-setting-button__icon'>
          <RecIcon fill={isRecording ? 'red' : 'white'} />
        </span>
      </button>
      {isRecording && <RecordOverlayPortal />}
    </>
  )
}
