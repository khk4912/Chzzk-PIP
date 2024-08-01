import { useEffect, useState } from 'react'
import type { RecordInfo } from '../../../types/record_info'
import { getRecordInfo } from '../../../src/utils/record/record_info_helper'

interface DonwloadInfo {
  recordInfo: RecordInfo
  length: number
  fileName: string
}
export function ResultVideo (): React.ReactNode {
  const [recordInfo, setRecordInfo] = useState<RecordInfo>()
  const [downloadInfo, setDownloadInfo] = useState<DonwloadInfo>()

  const onLoadedMetadataHandler = async (): Promise<void> => {
    if (recordInfo === undefined) {
      return
    }

    const video = document.querySelector('video')

    if (!(video instanceof HTMLVideoElement) || recordInfo === undefined) {
      return
    }

    let duration: number = 0

    video.currentTime = Number.MAX_SAFE_INTEGER
    await new Promise(resolve => setTimeout(resolve, 500))
    video.currentTime = 0

    duration = video.duration

    if (duration === Infinity) {
      duration = (recordInfo.stopDateTime - recordInfo.startDateTime) / 1000 - 0.1
    }

    const fileName = `${recordInfo.streamInfo.streamerName}_${duration.toFixed(2)}s`
    setDownloadInfo({ recordInfo, length: duration, fileName })
  }

  useEffect(() => {
    getRecordInfo()
      .then(setRecordInfo)
      .catch(console.error)
  }, [])

  useEffect(() => {
    console.log('changed downloadInfo')
    console.log(downloadInfo)
  }, [downloadInfo])

  return (
    <video
      id='video'
      preload='metadata'
      src={recordInfo?.resultBlobURL}
      controls muted
      onLoadedMetadata={() => { void onLoadedMetadataHandler() }}
    />
  )
}
