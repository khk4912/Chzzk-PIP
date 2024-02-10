import type { Video, StreamInfo, HighFPSRecorder } from '../../types/record'
import { getOption } from '../options/option_handler'

const mutedHandler = (video: Video): void => {
  if (video.muted || video.volume === 0) {
    video.muted = false
    video.volume = 0.5
  }
}

export async function startRecord (video: Video, streamInfo: StreamInfo): Promise<MediaRecorder> {
  mutedHandler(video)

  const stream = video.captureStream()
  const recorder = new MediaRecorder(
    stream,
    {
      mimeType: 'video/webm',
      videoBitsPerSecond: 7000000
    }
  )

  const date = new Date()
  await chrome.storage.local.set({
    recorderBlob: '',
    streamInfo,
    recorderStartTime: date.getTime(),
    highFPS: false
  })

  recorder.ondataavailable = async (event) => {
    if (event.data.size === 0) return

    const url = URL.createObjectURL(event.data)
    await chrome.storage.local.set({ recorderBlob: url })
  }

  recorder.start()
  return recorder
}

export async function stopRecord (recorder: MediaRecorder): Promise<void> {
  recorder.stop()
  const recorderStopTime = new Date().getTime()
  await chrome.storage.local.set({ recorderStopTime })

  const { fastRec } = await getOption()
  const {
    recorderBlob,
    streamInfo,
    recorderStartTime
  } = await chrome.storage.local.get(
    [
      'recorderBlob',
      'streamInfo',
      'recorderStartTime'
    ]) as { recorderBlob: string, streamInfo: StreamInfo, recorderStartTime: number }

  if (!fastRec && recorderBlob !== '') {
    window.open(chrome.runtime.getURL('pages/record.html'))
    return
  }

  if (typeof recorderBlob !== 'string') {
    return
  }

  const video = document.createElement('video')
  video.src = recorderBlob
  video.preload = 'metadata'

  video.addEventListener('loadedmetadata', () => {
    void (async () => {
      video.currentTime = Number.MAX_SAFE_INTEGER
      await new Promise(resolve => setTimeout(resolve, 500))
      video.currentTime = 0

      let duration = video.duration
      if (duration === Infinity) {
        duration = (recorderStopTime - recorderStartTime) / 1000 - 0.1
      }

      const fileName = `${streamInfo.streamerName}_${duration}s`

      const a = document.createElement('a')
      a.href = recorderBlob
      a.download = `${fileName}.webm`

      a.click()

      URL.revokeObjectURL(recorderBlob)
    })()
  })
}

export async function startHighFPSRecord (
  video: Video,
  streamInfo: StreamInfo
): Promise<HighFPSRecorder> {
  mutedHandler(video)

  const canvas = document.createElement('canvas')
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight

  const canvasInterval = setInterval(() => {
    const ctx = canvas.getContext('2d')
    if (ctx === null) return

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
  }, 1000 / 60)

  const videoRecorder = new MediaRecorder(canvas.captureStream(), {
    mimeType: 'video/webm',
    videoBitsPerSecond: 7000000
  })
  const audioRecorder = new MediaRecorder(video.captureStream(), {
    mimeType: 'audio/webm'
  })

  const date = new Date()
  await chrome.storage.local.set({
    recorderBlob: '',
    auidoRecorderBlob: '',
    streamInfo,
    recorderStartTime: date.getTime()
    highFPS: true
  })

  videoRecorder.ondataavailable = async (event) => {
    if (event.data.size === 0) return

    const url = URL.createObjectURL(event.data)
    await chrome.storage.local.set({ recorderBlob: url })
  }

  audioRecorder.ondataavailable = async (event) => {
    if (event.data.size === 0) return

    const url = URL.createObjectURL(event.data)
    await chrome.storage.local.set({ auidoRecorderBlob: url })
  }

  return { videoRecorder, audioRecorder, canvasInterval }
}

export async function stopHighFPSRecord (
  videoRecorder: MediaRecorder,
  audioRecorder: MediaRecorder,
  canvasInterval: NodeJS.Timeout): Promise<void> {
  videoRecorder.stop()
  audioRecorder.stop()
  clearInterval(canvasInterval)

  const {
    recorderBlob,
    audioRecorderBlob
  } = await chrome.storage.local.get(
    [
      'recorderBlob',
      'audioRecorderBlob'
    ]) as {
    recorderBlob: string
    audioRecorderBlob: string
  }

  if (recorderBlob !== '' && audioRecorderBlob !== '') {
    window.open(chrome.runtime.getURL('pages/record.html'))
  }
}
