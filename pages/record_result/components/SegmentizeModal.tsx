import ReactDOM from 'react-dom'

import { ModalBase } from './ModalBase'
import type { DownloadInfo } from '../../../types/record_info'
import style from './SegmentizeModal.module.css'
import { ButtonBase } from './Button'
import { useRef } from 'react'
import { segmentize, useFFmpeg } from '../../../src/utils/record/transcode'
import type { FFmpeg } from '@ffmpeg/ffmpeg'

export function SegmentizeModalPortal ({ setModalState, downloadInfo, ffmpeg }: { setModalState: (x: boolean) => void, downloadInfo: DownloadInfo | undefined, ffmpeg: FFmpeg | undefined }): React.ReactNode {
  const segmentModal = document.getElementById('segmentize-modal')

  if (segmentModal == null) {
    return null
  }

  return ReactDOM.createPortal(
    <SegmentizeModal
      setModalState={setModalState}
      downloadInfo={downloadInfo}
      ffmpeg={ffmpeg}
    />, segmentModal
  )
}

function SegmentizeModal (
  { setModalState, downloadInfo, ffmpeg }:
  { setModalState: (x: boolean) => void, downloadInfo: DownloadInfo | undefined, ffmpeg: FFmpeg | undefined }): React.ReactNode {
  const targetRef = useRef<HTMLInputElement>(null)

  return (
    <ModalBase>
      <div className={style.header}>
        <h1>분할 다운로드</h1>
        <span>
          영상을 원하는 길이의 영상 여러 개로 자를 수 있어요.<br />
          브라우저의 한계로 오류가 발생하거나, 목표 시간보다 수 초의 오차가 발생할 수 있어요.
        </span>
      </div>

      <div className={style.input}>
        <input ref={targetRef} defaultValue='0' /> 초로 나누기
      </div>

      <div className={`${style.buttons}`}>
        <ButtonBase
          onClick={() => {
            if (downloadInfo === undefined || ffmpeg === undefined) {
              return
            }

            const target = targetRef.current?.value
            if (target === undefined) {
              return
            }

            const x = Number(target)
            if (isNaN(x) || x <= 0) {
              return
            }

            void segmentize(ffmpeg, downloadInfo.recordInfo.resultBlobURL, x | 0).then(
              (urls) => {
                urls.forEach((url, i) => {
                  const a = document.createElement('a')
                  a.href = url
                  a.download = `${downloadInfo.fileName ?? 'title'}_${i}.mp4`
                  a.click()
                })
                setModalState(false)
              }
            )
          }}
        >다운로드
        </ButtonBase>
        <ButtonBase onClick={(e: KeyboardEvent) => {
          setModalState(false)
          e.stopPropagation()
        }}
        >닫기
        </ButtonBase>
      </div>
    </ModalBase>
  )
}
