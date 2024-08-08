import { useEffect } from 'react'
import { useFFmpeg, toMP4, toMP4AAC, toGIF, toWEBP, trim } from '../../../src/utils/record/transcode'
import type { DownloadInfo } from '../../../types/record_info'
import { ButtonBase } from './Button'

export function DownloadButtons ({ downloadInfo, setSegmentizeModalState, setSliceModalState }: { downloadInfo: DownloadInfo | undefined, setSegmentizeModalState: (x: boolean) => void, setSliceModalState: (x: boolean) => void }): React.ReactNode {
  const download = (url: string | undefined, ext: string): void => {
    if (url === undefined) {
      return
    }

    const a = document.createElement('a')
    a.href = url
    a.download = `${downloadInfo?.fileName ?? 'title'}.${ext}` ?? ''
    a.click()
  }

  const isMP4 = downloadInfo?.recordInfo.isMP4 ?? false

  const [ffmpeg, isFFmpegReady] = useFFmpeg()
  useEffect(() => { console.log(isFFmpegReady) }, [isFFmpegReady])

  return (
    <div className={`download-buttons ${downloadInfo === undefined ? 'disabled' : ''}`}>
      <ButtonBase onClick={() => { download(downloadInfo?.recordInfo?.resultBlobURL, 'webm') }}>
        다운로드
      </ButtonBase>

      <h3>변환 후 다운로드</h3>
      {isMP4 && '이미 MP4로 녹화되어 MP4로 변환은 숨겨졌어요.'}

      <div className={`after-transcode ${!isFFmpegReady ? 'disabled' : ''}`}>

        {!isMP4 &&
          <>
            <ButtonBase onClick={() => {
              void toMP4(ffmpeg.current, downloadInfo?.recordInfo.resultBlobURL ?? '')
                .then((url) => { download(url, 'mp4') })
            }}
            >MP4
            </ButtonBase>
            <ButtonBase onClick={() => {
              void toMP4AAC(ffmpeg.current, downloadInfo?.recordInfo.resultBlobURL ?? '')
                .then((url) => { download(url, 'mp4') })
            }}
            >MP4 (호환성)
            </ButtonBase>
          </>}
        <ButtonBase onClick={() => {
          void toGIF(ffmpeg.current, downloadInfo?.recordInfo.resultBlobURL ?? '')
            .then((url) => { download(url, 'gif') })
        }}
        >GIF
        </ButtonBase>
        <ButtonBase onClick={() => {
          void toWEBP(ffmpeg.current, downloadInfo?.recordInfo.resultBlobURL ?? '')
            .then((url) => { download(url, 'mp4') })
        }}
        >WEBP
        </ButtonBase>
      </div>
      <div className='after-transcode'>
        <ButtonBase onClick={() => {
          setSliceModalState(true)
        }}
        >자르고 다운로드
        </ButtonBase>
        <ButtonBase onClick={() => {
          setSegmentizeModalState(true)
        }}
        >분할 다운로드
        </ButtonBase>
      </div>

    </div>

  )
}
