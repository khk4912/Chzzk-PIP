import ReactDOM from 'react-dom'

import { ModalBase } from './ModalBase'
import type { DownloadInfo } from '../../../types/record_info'
import style from './TrimModal.module.css'
import { ButtonBase } from './Button'
import { useRef, useState } from 'react'
import { trim } from '../../../src/utils/record/transcode'
import type { FFmpeg } from '@ffmpeg/ffmpeg'
import { ProgressModalPortal } from './ProgressModal'

export function TrimModalPortal ({ setModalState, downloadInfo, ffmpeg, progress }: { setModalState: (x: boolean) => void, downloadInfo: DownloadInfo | undefined, ffmpeg: FFmpeg | undefined, progress: number }): React.ReactNode {
  const trimModal = document.getElementById('trim-modal')

  if (trimModal == null) {
    return null
  }

  return ReactDOM.createPortal(
    <TrimModal
      setModalState={setModalState}
      downloadInfo={downloadInfo}
      ffmpeg={ffmpeg}
      progress={progress}
    />, trimModal
  )
}

/**
 * TrimModal component
 *
 * '자르고 다운로드' 기능을 위한 모달 컴포넌트입니다.
 */
function TrimModal (
  { setModalState, downloadInfo, ffmpeg, progress }:
  { setModalState: (x: boolean) => void, downloadInfo: DownloadInfo | undefined, ffmpeg: FFmpeg | undefined, progress: number }): React.ReactNode {
  const startRef = useRef<HTMLInputElement>(null)
  const endRef = useRef <HTMLInputElement>(null)

  const [progressModal, setProgressModal] = useState(false)

  const trimHandler = (): void => {
    if (downloadInfo === undefined || ffmpeg === undefined) {
      return
    }

    const start = Number(startRef.current?.value)
    const end = Number(endRef.current?.value)

    if (isNaN(start) || isNaN(end) ||
        start < 0 || end < 0 ||
        start >= end) {
      return
    }

    setModalState(false)
    setProgressModal(true)

    trim(ffmpeg, downloadInfo.recordInfo.resultBlobURL, start | 0, end | 0)
      .then((url) => {
        const a = document.createElement('a')
        a.href = url
        a.download = `${downloadInfo.fileName ?? 'title'}_trim_${start | 0}-${end}.mp4`
        a.click()
      })
      .catch(console.info)
      .finally(() => {
        setProgressModal(false)
        setModalState(false)
      })
  }

  return (
    <ModalBase>
      {progressModal && <ProgressModalPortal progress={progress} />}

      <div className={style.header}>
        <h1>자르고 다운로드</h1>
        <span>
          영상의 원하는 부분만 자른 후 다운로드할 수 있어요.<br />
          브라우저의 한계로 오류가 발생하거나, 목표 시간보다 수 초의 오차가 발생할 수 있어요.
        </span>
      </div>

      <div className={style.input}>
        <input ref={startRef} defaultValue='0' /> 초 부터 <input ref={endRef} defaultValue='0' /> 초까지 자르기
      </div>

      <div className={`${style.buttons}`}>
        <ButtonBase
          onClick={() => { trimHandler() }}
        >다운로드
        </ButtonBase>
        <ButtonBase onClick={() => { setModalState(false) }}>닫기</ButtonBase>
      </div>
    </ModalBase>
  )
}
