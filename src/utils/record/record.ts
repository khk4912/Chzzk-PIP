import { getOption } from '../../../types/options'
import type { RecordInfo } from '../../../types/record_info'
import { getStreamInfo } from '../stream_info'
import { getRecordInfo, setRecordInfo } from './record_info_helper'

const getChromeVersion = (): number | false => {
  const raw = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./)

  return (raw != null) ? parseInt(raw[2], 10) : false
}

const checkMP4 = async (): Promise<boolean> => {
  const isAboveChrome128 = Number(getChromeVersion()) >= 128
  const isSupportMP4 = MediaRecorder.isTypeSupported('video/mp4;codecs=avc1,mp4a.40.2')
  const preferMP4 = (await getOption()).preferMP4

  const isMP4 = isSupportMP4 && isAboveChrome128 && preferMP4
  return isMP4
}

export async function startRecord (video: HTMLVideoElement): Promise<MediaRecorder | null> {
  const streamInfo = getStreamInfo(document)
  const stream = video.captureStream()

  const isMP4 = await checkMP4()
  const recorder = new MediaRecorder(stream, {
    mimeType:
    isMP4
      ? 'video/mp4;codecs=avc1,mp4a.40.2'
      : 'video/webm;codecs=avc1',
    videoBitsPerSecond: 8000000
  })

  const newRecordInfo: RecordInfo = {
    startDateTime: new Date().getTime(),
    stopDateTime: -1,
    resultBlobURL: '',
    streamInfo,
    isMP4
  }

  recorder.recordInfo = newRecordInfo
  recorder.ondataavailable = async (event) => {
    if (event.data.size === 0) return

    if (recorder.recordInfo === undefined) {
      return
    }

    recorder.recordInfo.resultBlobURL = URL.createObjectURL(event.data)
  }

  recorder.start()
  return recorder
}

export async function startHighFrameRateRecord (video: HTMLVideoElement): Promise<readonly [MediaRecorder, number] | null> {
  const streamInfo = getStreamInfo(document)
  const isMP4 = await checkMP4()

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if (ctx === null) {
    return null
  }

  canvas.width = video.videoWidth
  canvas.height = video.videoHeight

  const highFrameRateCanvasInteval = window.setInterval(() => {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
  }, 1000 / 60)

  const videoStream = canvas.captureStream(60)
  const recordingStream = new MediaStream()

  videoStream.getVideoTracks().forEach(track => {
    recordingStream.addTrack(track)
  })
  recordingStream.addTrack(video.captureStream().getAudioTracks()[0])

  const newRecordInfo: RecordInfo = {
    startDateTime: new Date().getTime(),
    stopDateTime: -1,
    resultBlobURL: '',
    streamInfo,
    isMP4
  }

  const videoRecorder = new MediaRecorder(
    recordingStream,
    {
      mimeType: isMP4
        ? 'video/mp4;codecs=avc1,mp4a.40.2'
        : 'video/webm;codecs=avc1',
      videoBitsPerSecond: 8000000
    }
  )
  videoRecorder.recordInfo = newRecordInfo
  videoRecorder.ondataavailable = async (event) => {
    if (event.data.size === 0) return

    if (videoRecorder.recordInfo === undefined) {
      return
    }

    videoRecorder.recordInfo.resultBlobURL = URL.createObjectURL(event.data)
  }
  videoRecorder.start()
  await setRecordInfo(newRecordInfo)

  return [videoRecorder, highFrameRateCanvasInteval] as const
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

      await setRecordInfo(info)
      resolve(null)
    }
  })

  const info = await getRecordInfo()
  return info
}

export async function stopHighFrameRec (videoRecorder: MediaRecorder, canvasInterval: number): Promise<RecordInfo> {
  videoRecorder.stop()
  clearInterval(canvasInterval)

  await new Promise((resolve) => {
    videoRecorder.onstop = async () => {
      const info = await getRecordInfo()
      info.stopDateTime = new Date().getTime()

      await setRecordInfo(info)
      resolve(null)
    }
  })

  const info = await getRecordInfo()
  return info
}
