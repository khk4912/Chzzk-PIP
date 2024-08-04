import { useRef, useState } from 'react'
import RecIcon from '../../static/rec.svg?react'
import { startRecord, stopRecord } from '../utils/record/record'
import { useShortcut } from '../utils/hooks'

export function RecordButton (): React.ReactNode {
  const [isRecording, setIsRecording] = useState(false)
  const recorder = useRef<MediaRecorder>()
  useShortcut(['r', 'R', 'ㄱ'], () => { void clickHandler() })

  const clickHandler = async (): Promise<void> => {
    const video: HTMLVideoElement | null = document.querySelector('.webplayer-internal-video')
    if (video === null) {
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
  }

  return (
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
  )
}
