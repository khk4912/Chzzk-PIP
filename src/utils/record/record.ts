import type { RecordInfo } from '../../../types/record_info'
import { getStreamInfo } from '../stream_info'
import { getRecordInfo, setRecordInfo } from './record_info_helper'

export async function startRecord (video: HTMLVideoElement): Promise<MediaRecorder | null> {
  const streamInfo = getStreamInfo(document)
  const stream = video.captureStream()

  const isSupportMP4 = MediaRecorder.isTypeSupported('video/mp4;codecs=avc1,mp4a.40.2')
  const recorder = new MediaRecorder(stream, {
    mimeType:
     isSupportMP4
       ? 'video/mp4;codecs=avc1,mp4a.40.2'
       : 'video/webm;codecs=avc1',
    videoBitsPerSecond: 8000000
  })

  const newRecordInfo = {
    startDateTime: new Date().getTime(),
    stopDateTime: -1,
    resultBlobURL: '',
    streamInfo,
    isMP4: isSupportMP4
  }

  recorder.recordInfo = newRecordInfo
  let tempBlobURL = ''

  recorder.ondataavailable = async (event) => {
    if (event.data.size === 0) return

    const prev = tempBlobURL
    tempBlobURL = URL.createObjectURL(event.data)

    URL.revokeObjectURL(prev)
    recorder.tempBlobURL = tempBlobURL
  }

  recorder.start()
  return recorder
}

export async function stopRecord (recorder: MediaRecorder): Promise<RecordInfo> {
  recorder.stop()

  await new Promise((resolve) => {
    recorder.onstop = async () => {
      const info = recorder.recordInfo

      if (info === undefined) {
        return
      }

      info.stopDateTime = new Date().getTime()
      info.resultBlobURL = recorder.tempBlobURL ?? ''

      await setRecordInfo(info)
      resolve(null)
    }
  })

  const info = await getRecordInfo()
  return info
}
