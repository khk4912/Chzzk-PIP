import React, { useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'

import RecIcon from '../../static/rec.svg?react'
import { useShortcut } from '../utils/hooks'
import { startRecord, stopRecord } from '../utils/record/record'
import { RecordOverlayPortal } from './rec_overlay'

export function RecordPortal ({ tg }: { tg: Element | undefined }): React.ReactNode {
  if (tg === undefined) {
    return null
  }

  const div = document.createElement('div')
  div.id = 'chzzk-pip-rec-button'

  tg.insertBefore(div, tg.firstChild)
  return ReactDOM.createPortal(<RecordButton />, div)
}

async function _stopRecord (recorder: React.MutableRefObject<MediaRecorder | undefined>): Promise<void> {
  if (recorder.current === undefined) {
    return
  }

  const info = await stopRecord(recorder.current)
  recorder.current = undefined

  if (info.resultBlobURL === '') {
    return
  }

  window.open(chrome.runtime.getURL('/pages/record_result/index.html'))
}

function RecordButton (): React.ReactNode {
  const [isRecording, setIsRecording] = useState(false)
  const recorder = useRef<MediaRecorder>()

  useEffect(() => {
    return () => {
      if (isRecording) {
        void _stopRecord(recorder)
      }
    }
  }, [isRecording])

  useShortcut(['r', 'R', 'ㄱ'], () => { void clickHandler() })

  const clickHandler = async (): Promise<void> => {
    const video: HTMLVideoElement | null = document.querySelector('.webplayer-internal-video')
    if (video === null) {
      return
    }

    if (video.muted) {
      alert('음소거된 비디오는 녹화할 수 없습니다.')
      return
    }

    const newRec = !isRecording
    setIsRecording(newRec)

    if (newRec) {
      const _recorder = await startRecord(video)

      if (_recorder === null) {
        return
      }
      recorder.current = _recorder
    } else {
      await _stopRecord(recorder)
    }
  }

  return (
    <>
      <button
        className='pzp-button pzp-pc-setting-button pzp-pc__setting-button pzp-pc-ui-button chzzk-record-button'
        onClick={() => { void clickHandler() }}
      >
        <span className='pzp-pc-ui-button__tooltip pzp-pc-ui-button__tooltip--top'>
          {isRecording ? '녹화 중지' : '녹화'} (r)
        </span>
        <span className='pzp-ui-icon pzp-pc-setting-button__icon'>
          <RecIcon fill={isRecording ? 'red' : 'white'} />
        </span>
      </button>
      {isRecording && <RecordOverlayPortal />}
    </>
  )
}
