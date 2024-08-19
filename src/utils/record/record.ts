import type { RecordInfo } from '../../../types/record_info'
import { getStreamInfo } from '../stream_info'
import { getRecordInfo, setRecordInfo } from './record_info_helper'

const getChromeVersion = (): number | false => {
  const raw = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./)

  return (raw != null) ? parseInt(raw[2], 10) : false
}

export async function startRecord (video: HTMLVideoElement): Promise<MediaRecorder | null> {
  const streamInfo = getStreamInfo(document)
  const stream = video.captureStream()

  // Check if chrome version is above 128
  const isAboveChrome128 = Number(getChromeVersion()) >= 128

  const isSupportMP4 = MediaRecorder.isTypeSupported('video/mp4;codecs=avc1,mp4a.40.2')
  const recorder = new MediaRecorder(stream, {
    mimeType:
     isSupportMP4 && isAboveChrome128
       ? 'video/mp4;codecs=avc1,mp4a.40.2'
       : 'video/webm;codecs=avc1',
    videoBitsPerSecond: 8000000
  })

  const newRecordInfo: RecordInfo = {
    startDateTime: new Date().getTime(),
    stopDateTime: -1,
    resultBlobURL: '',
    streamInfo,
    isMP4: isSupportMP4 && isAboveChrome128,
    chunks: []
  }

  recorder.recordInfo = newRecordInfo

  recorder.ondataavailable = async (event) => {
    if (event.data.size === 0) return
    newRecordInfo.chunks?.push(event.data)
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

      if (info.chunks === undefined || info.chunks.length === 0) {
        return
      }

      info.stopDateTime = new Date().getTime()
      info.resultBlobURL = URL.createObjectURL(new Blob(info.chunks, { type: info.isMP4 ? 'video/mp4' : 'video/webm' }))

      await setRecordInfo(info)
      resolve(null)
    }
  })

  const info = await getRecordInfo()
  return info
}
