import { useEffect } from 'react'
import { getRecordInfo } from '../../src/utils/record_info_helper'
import './style.css'

export default function App (): React.ReactNode {
  useEffect(() => {
    const video = document.getElementById('video') as HTMLVideoElement

    const init = async (): Promise<void> => {
      const info = await getRecordInfo()
      video.src = info.resultBlobURL
    }

    void init()
  })

  return (
    <video id='video' controls autoPlay muted />
  )
}
