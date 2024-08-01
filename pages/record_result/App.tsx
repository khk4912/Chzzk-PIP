import { useEffect, useState } from 'react'
import { getRecordInfo } from '../../src/utils/record/record_info_helper'
import './style.css'
import type { RecordInfo } from '../../types/record_info'

interface DonwloadInfo {
  recordInfo: RecordInfo
  length: number
  fileName: string
}

export default function App (): React.ReactNode {
  const [recordInfo, setRecordInfo] = useState<RecordInfo>()
  const [downloadInfo, setDownloadInfo] = useState<DonwloadInfo>()

  useEffect(() => {
    console.log('initial load')
    getRecordInfo()
      .then((x) => {
        setRecordInfo(x)

        const recInfo = x
        getDuration().then((length) => {
          if (recInfo === undefined) {
            return
          }

          const duration = recInfo.stopDateTime - recInfo.startDateTime
          const len = length === Infinity ? duration : length

          const fileName = `${recInfo.streamInfo.streamerName}_${len.toFixed(2)}`
          console.log('Set download Info to', {
            recordInfo, length: len, fileName
          })
          setDownloadInfo({
            recordInfo: recInfo, length: len, fileName
          })
        }).catch(console.error)
      }
      )
      .catch(console.error)
  }, [])

  useEffect(() => {
    console.log('changed downloadInfo')
    console.log(downloadInfo)
  }, [downloadInfo])

  return (
    <video
      id='video'
      src={recordInfo?.resultBlobURL}
      controls muted
    />
  )
}

async function getDuration (): Promise<number> {
  const video = document.querySelector('video')

  if (video === null) {
    return Infinity
  }

  console.log(video.readyState)
  if (video.readyState < HTMLMediaElement.HAVE_METADATA) {
    await new Promise((resolve) => {
      video.addEventListener('onloadedmetadata', resolve)
    })
  }

  console.log(video.readyState)
  video.currentTime = Number.MAX_SAFE_INTEGER
  await new Promise(resolve => setTimeout(resolve, 500))
  video.currentTime = 0

  return video.duration
}
