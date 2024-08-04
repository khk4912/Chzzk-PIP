import type { DownloadInfo } from '../../../types/record_info'
import { ButtonBase } from './Button'

export function DownloadButtons ({ downloadInfo }: { downloadInfo: DownloadInfo | undefined }): React.ReactNode {
  const download = (): void => {
    const a = document.createElement('a')
    a.href = downloadInfo?.recordInfo.resultBlobURL ?? ''
    a.download = `${downloadInfo?.fileName ?? 'title'}.webm` ?? ''
    a.click()
  }

  return (
    <div className='download-buttons'>
      <ButtonBase onClick={download}>
        다운로드
      </ButtonBase>

      <h3>변환 후 다운로드</h3>
      <div className='after-transcode'>
        <ButtonBase onClick={download}>MP4</ButtonBase>
        <ButtonBase onClick={download}>MP4 (호환성)</ButtonBase>
        <ButtonBase onClick={download}>GIF</ButtonBase>
        <ButtonBase onClick={download}>WEBP</ButtonBase>
      </div>
      <div className='after-transcode'>
        <ButtonBase onClick={download}>자르고 다운로드</ButtonBase>
        <ButtonBase onClick={download}>분할 다운로드</ButtonBase>
      </div>

    </div>

  )
}
