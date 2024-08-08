import './style.css'
import { ResultVideo } from './components/ResultVideo'
import { useState } from 'react'
import type { DownloadInfo } from '../../types/record_info'
import { DownloadButtons } from './components/DownloadButtons'
import { SegmentizeModalPortal } from './components/SegmentizeModal'
import { TrimModalPortal } from './components/TrimModal'

export default function App (): React.ReactNode {
  const [downloadInfo, setDownloadInfo] = useState<DownloadInfo>()
  const [trimModal, setTrimModal] = useState(false)
  const [segmentizeModal, setSegmentizeModal] = useState(false)

  return (
    <>
      <span id='header'>녹화 완료!</span>
      <ResultVideo setDownloadInfo={setDownloadInfo} />
      <DownloadButtons downloadInfo={downloadInfo} setSegmentizeModalState={setSegmentizeModal} setSliceModalState={setTrimModal} />

      {segmentizeModal &&
        <SegmentizeModalPortal
          setModalState={setSegmentizeModal}
          downloadInfo={downloadInfo}
        />}

      {trimModal &&
        <TrimModalPortal
          setModalState={setTrimModal}
          downloadInfo={downloadInfo}
        />}
    </>
  )
}
