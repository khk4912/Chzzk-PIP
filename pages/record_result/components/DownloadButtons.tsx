import { useEffect, useState } from 'react'
import { useFFmpeg, toMP4, toMP4AAC, toGIF, toWEBP } from '../../../src/utils/record/transcode'
import type { DownloadInfo } from '../../../types/record_info'
import { ButtonBase } from './Button'
import { TrimModalPortal } from './TrimModal'
import { SegmentizeModalPortal } from './SegmentizeModal'
import { ProgressModalPortal } from './ProgressModal'

export function DownloadButtons (
  { downloadInfo }:
  { downloadInfo: DownloadInfo | undefined }
): React.ReactNode {
  const [trimModalState, setTrimModalState] = useState(false)
  const [segmentizeModalState, setSegmentizeModalState] = useState(false)
  const [progressModalState, setProgressModalState] = useState(false)

  const download = (
    url: string | undefined,
    ext: string,
    title?: string): void => {
    if (url === undefined) {
      return
    }

    const a = document.createElement('a')
    a.href = url
    a.download = title ?? `${downloadInfo?.fileName ?? 'title'}.${ext}`
    a.click()
  }

  const isMP4 = downloadInfo?.recordInfo.isMP4 ?? false

  const [ffmpeg, isFFmpegReady, progress] = useFFmpeg(downloadInfo?.length ?? NaN)
  useEffect(() => { console.log(isFFmpegReady) }, [isFFmpegReady])

  return (
    <div className={`download-buttons ${downloadInfo === undefined || trimModalState || segmentizeModalState ? 'disabled' : ''}`}>
      <ButtonBase onClick={() => { download(downloadInfo?.recordInfo?.resultBlobURL, 'webm') }}>
        다운로드
      </ButtonBase>

      <h3>변환 후 다운로드</h3>
      {isMP4 && '이미 MP4로 녹화되어 MP4로 변환은 숨겨졌어요.'}

      <div className={`after-transcode ${!isFFmpegReady ? 'disabled' : ''}`}>

        {!isMP4 &&
          <>
            <ButtonBase onClick={() => {
              setProgressModalState(true)
              void toMP4(ffmpeg.current, downloadInfo?.recordInfo.resultBlobURL ?? '')
                .then((url) => { download(url, 'mp4') })
                .finally(
                  () => { setProgressModalState(false) }
                )
            }}
            >MP4
            </ButtonBase>
            <ButtonBase onClick={() => {
              setProgressModalState(true)
              void toMP4AAC(ffmpeg.current, downloadInfo?.recordInfo.resultBlobURL ?? '')
                .then((url) => { download(url, 'mp4') })
                .finally(
                  () => { setProgressModalState(false) }
                )
            }}
            >MP4 (호환성)
            </ButtonBase>
          </>}
        <ButtonBase onClick={() => {
          setProgressModalState(true)
          void toGIF(ffmpeg.current, downloadInfo?.recordInfo.resultBlobURL ?? '')
            .then((url) => { download(url, 'gif') })
            .finally(
              () => { setProgressModalState(false) }
            )
        }}
        >GIF
        </ButtonBase>
        <ButtonBase onClick={() => {
          setProgressModalState(true)
          void toWEBP(ffmpeg.current, downloadInfo?.recordInfo.resultBlobURL ?? '')
            .then((url) => { download(url, 'webp') })
            .finally(
              () => { setProgressModalState(false) }
            )
        }}
        >WEBP
        </ButtonBase>
      </div>
      <div className={`after-transcode ${!isFFmpegReady ? 'disabled' : ''}`}>
        <ButtonBase onClick={() => {
          setTrimModalState(true)
        }}
        >자르고 다운로드
        </ButtonBase>
        <ButtonBase onClick={() => {
          setSegmentizeModalState(true)
        }}
        >분할 다운로드
        </ButtonBase>
      </div>

      {trimModalState && <TrimModalPortal ffmpeg={ffmpeg.current} progress={progress} setModalState={setTrimModalState} downloadInfo={downloadInfo} />}
      {segmentizeModalState && <SegmentizeModalPortal ffmpeg={ffmpeg.current} progress={progress} setModalState={setSegmentizeModalState} downloadInfo={downloadInfo} />}
      {progressModalState && <ProgressModalPortal progress={progress} />}
    </div>
  )
}
