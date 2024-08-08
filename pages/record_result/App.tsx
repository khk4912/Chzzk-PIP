import './style.css'
import { ResultVideo } from './components/ResultVideo'
import { useState } from 'react'
import type { DownloadInfo } from '../../types/record_info'
import { DownloadButtons } from './components/DownloadButtons'

export default function App (): React.ReactNode {
  const [downloadInfo, setDownloadInfo] = useState<DownloadInfo>()

  return (
    <>
      <span id='header'>녹화 완료!</span>
      <ResultVideo setDownloadInfo={setDownloadInfo} />
      <DownloadButtons downloadInfo={downloadInfo} />
    </>
  )
}
