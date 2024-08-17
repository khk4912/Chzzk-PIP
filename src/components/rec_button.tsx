import React, { useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'

import RecIcon from '../../static/rec.svg?react'
import { useShortcut } from '../utils/hooks'
import { startRecord, stopRecord } from '../utils/record/record'
import { RecordOverlayPortal } from './rec_overlay'
import { getOption } from '../../types/options'
import { download } from '../utils/download/clip'

export function RecordPortal ({ tg }: { tg: Element | undefined }): React.ReactNode {
  if (tg === undefined) {
    return null
  }

  const div = document.createElement('div')
  div.id = 'chzzk-pip-rec-button'

  tg.insertBefore(div, tg.firstChild)
  return ReactDOM.createPortal(<RecordButton />, div)
}

async function _stopRecord (
  recorder: React.MutableRefObject<MediaRecorder | undefined>,
  fastRec: boolean
): Promise<void> {
  if (recorder.current === undefined) {
    return
  }

  const info = await stopRecord(recorder.current)
  recorder.current = undefined

  if (info.resultBlobURL === '') {
    return
  }

  if (fastRec) {
    const video = document.createElement('video')
    video.src = info.resultBlobURL
    video.preload = 'metadata'

    video.onloadedmetadata = () => {
      void (async (): Promise<void> => {
        let duration: number = 0

        video.currentTime = Number.MAX_SAFE_INTEGER
        await new Promise(resolve => setTimeout(resolve, 500))
        video.currentTime = 0

        duration = video.duration

        if (duration === Infinity) {
          duration = (info.stopDateTime - info.startDateTime) / 1000 - 0.1
        }

        duration = video.duration

        const fileName = `${info.streamInfo.streamerName}_${duration.toFixed(2)}`

        await download(info.resultBlobURL, fileName, info.isMP4 ? 'mp4' : 'webm')
        URL.revokeObjectURL(info.resultBlobURL)
      })()
    }
    return
  }

  window.open(chrome.runtime.getURL('/pages/record_result/index.html'))
}

function RecordButton (): React.ReactNode {
  const [isRecording, setIsRecording] = useState(false)
  const [fastRec, setFastRec] = useState(false)
  const recorder = useRef<MediaRecorder>()

  useEffect(() => {
    return () => {
      if (isRecording) {
        void _stopRecord(recorder, fastRec)
      }
    }
  }, [isRecording, fastRec])

  useEffect(() => {
    void getOption()
      .then((opt) => {
        setFastRec(opt.fastRec)
      })
  }, [])

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
      await _stopRecord(recorder, fastRec)
    }
  }

  return (
    <>
      <button
        className='pzp-button pzp-pc-setting-button pzp-pc__setting-button pzp-pc-ui-button chzzk-record-button'
        onClick={() => { void clickHandler() }}
      >
        <span className='pzp-pc-ui-button__tooltip pzp-pc-ui-button__tooltip--top'>
          {isRecording ? '녹화 중지' : '녹화'} (R)
        </span>
        <span className='pzp-ui-icon pzp-pc-setting-button__icon'>
          <RecIcon fill={isRecording ? 'red' : 'white'} />
        </span>
      </button>
      {isRecording && <RecordOverlayPortal />}
    </>
  )
}
