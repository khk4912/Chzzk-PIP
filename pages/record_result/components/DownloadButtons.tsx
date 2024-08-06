import { useEffect } from 'react'
import { useFFmpeg, toMP4, toMP4AAC, toGIF, toWEBP } from '../../../src/utils/record/transcode'
import type { DownloadInfo } from '../../../types/record_info'
import { ButtonBase } from './Button'

export function DownloadButtons ({ downloadInfo }: { downloadInfo: DownloadInfo | undefined }): React.ReactNode {
  const download = (url: string | undefined, ext: string): void => {
    if (url === undefined) {
      return
    }

    const a = document.createElement('a')
    a.href = downloadInfo?.recordInfo.resultBlobURL ?? ''
    a.download = `${downloadInfo?.fileName ?? 'title'}.${ext}` ?? ''
    a.click()
  }

  const [ffmpeg, isFFmpegReady] = useFFmpeg()
  useEffect(() => { console.log(isFFmpegReady) }, [isFFmpegReady])

  return (
    <div className={`download-buttons ${downloadInfo === undefined ? 'disabled' : ''}`}>
      <ButtonBase onClick={() => { download(downloadInfo?.recordInfo?.resultBlobURL, 'webm') }}>
        다운로드
      </ButtonBase>

      <h3>변환 후 다운로드</h3>
      {((downloadInfo?.recordInfo.isMP4) ?? false) && '영상이 MP4로 MP4로 변환은 숨겨졌어요.'}

      <div className={`after-transcode ${!isFFmpegReady ? 'disabled' : ''}`}>

        {!((downloadInfo?.recordInfo.isMP4) ?? false) &&
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
        <ButtonBase>자르고 다운로드</ButtonBase>
        <ButtonBase>분할 다운로드</ButtonBase>
      </div>

    </div>

  )
}
