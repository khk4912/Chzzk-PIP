import type { Video, StreamInfo, HighFrameRecorder } from '../../types/record'
import { getOption } from '../options/option_handler'

const checkIsMuted = (video: Video): boolean => {
  return video.muted || video.volume === 0
}

export async function startRecord (video: Video, streamInfo: StreamInfo): Promise<MediaRecorder> {
  if (video instanceof HTMLVideoElement) {
    const isMuted = checkIsMuted(video)

    if (isMuted) {
      video.muted = false
      video.volume = 0.5
    }
  }

  const stream = video.captureStream()
  const recorder = new MediaRecorder(
    stream,
    {
      mimeType: 'video/webm;codecs=avc1',
      videoBitsPerSecond: 7000000
    }
  )

  const date = new Date()
  await chrome.storage.local.set({ highFrame: false, recorderBlob: '', streamInfo, recorderStartTime: date.getTime() })

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

export async function startHighFrameRecord (video: Video, streamInfo: StreamInfo): Promise<HighFrameRecorder> {
  if (!(video instanceof HTMLVideoElement)) {
    throw new Error('Not a video element')
  }

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (ctx === null) {
    throw new Error('No 2d context')
  }

  canvas.width = video.videoWidth
  canvas.height = video.videoHeight

  const highFrameCanvasInterval = setInterval(() => {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
  }, 1000 / 60)

  const videoMediaRecorder = new MediaRecorder(canvas.captureStream(60),
    {
      mimeType: 'video/webm;codecs=avc1',
      videoBitsPerSecond: 7000000
    }
  )
  const auidoTrackStream = new MediaStream()
  video.captureStream().getAudioTracks().forEach(track => {
    auidoTrackStream.addTrack(track)
  })

  const audioMediaRecorder = new MediaRecorder(auidoTrackStream)

  const date = new Date()
  await chrome.storage.local.set({ highFrame: true, videoRecorderBlob: '', audioRecorderBlob: '', streamInfo, recorderStartTime: date.getTime() })

  videoMediaRecorder.ondataavailable = async (event) => {
    if (event.data.size === 0) return

    const url = URL.createObjectURL(event.data)
    await chrome.storage.local.set({ videoRecorderBlob: url })
  }

  audioMediaRecorder.ondataavailable = async (event) => {
    if (event.data.size === 0) return

    const url = URL.createObjectURL(event.data)
    await chrome.storage.local.set({ audioRecorderBlob: url })
  }

  videoMediaRecorder.start()
  audioMediaRecorder.start()

  return {
    videoMediaRecorder,
    audioMediaRecorder,
    highFrameCanvasInterval
  }
}

export async function stopHighFrameRecord (highFPSRecorder: HighFrameRecorder): Promise<void> {
  const { videoMediaRecorder, audioMediaRecorder, highFrameCanvasInterval } = highFPSRecorder

  videoMediaRecorder.stop()
  audioMediaRecorder.stop()
  clearInterval(highFrameCanvasInterval)

  const { fastRec } = await getOption()
  const {
    videoRecorderBlob,
    audioRecorderBlob,
    streamInfo,
    recorderStartTime
  } = await chrome.storage.local.get(
    [
      'videoRecorderBlob',
      'auidoRecorderBlob',
      'streamInfo',
      'recorderStartTime'
    ]) as { videoRecorderBlob: string, audioRecorderBlob: string, streamInfo: StreamInfo, recorderStartTime: number }

  if (!fastRec && videoRecorderBlob !== '' && audioRecorderBlob !== '') {
    window.open(chrome.runtime.getURL('pages/record.html'))
    return
  }

  if (typeof videoRecorderBlob !== 'string' || typeof audioRecorderBlob !== 'string') {
    return
  }

  const video = document.createElement('video')
  // TODO: merge video and audio
}
