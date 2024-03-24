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
  const isMoz = navigator.userAgent.includes('Firefox')
  let stream: MediaStream
  if (isMoz) {
    stream = video.mozCaptureStream()
  } else {
    stream = video.captureStream()
  }

  const recorder = new MediaRecorder(
    stream,
    {
      mimeType: isMoz ? 'video/webm;codecs=vp8,opus' : 'video/webm;codecs=avc1',
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

  // TODO: Firefox needs more time to save the file, gonna find a better way to do this
  if (navigator.userAgent.includes('Firefox')) {
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

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

  const isMoz = navigator.userAgent.includes('Firefox')
  const stream = canvas.captureStream(60)

  const videoMediaRecorder = new MediaRecorder(stream,
    {
      mimeType: isMoz ? 'video/webm;codecs=vp8,opus' : 'video/webm;codecs=vp9',
      videoBitsPerSecond: 7000000
    }
  )
  const audioTrackStream = new MediaStream()
  video.captureStream().getAudioTracks().forEach(track => {
    audioTrackStream.addTrack(track)
  })

  const audioMediaRecorder = new MediaRecorder(audioTrackStream, {
    mimeType: 'audio/webm;codecs=opus'
  })

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

export async function stopHighFrameRecord (
  highFPSRecorder: HighFrameRecorder
): Promise<void> {
  const { videoMediaRecorder, audioMediaRecorder, highFrameCanvasInterval } = highFPSRecorder

  clearInterval(highFrameCanvasInterval)

  videoMediaRecorder.stop()
  audioMediaRecorder.stop()

  const recorderStopTime = new Date().getTime()
  await chrome.storage.local.set({ recorderStopTime })

  const {
    videoRecorderBlob,
    audioRecorderBlob
  } = await chrome.storage.local.get(
    [
      'videoRecorderBlob',
      'audioRecorderBlob'
    ]) as {
    videoRecorderBlob: string
    audioRecorderBlob: string
  }

  if (videoRecorderBlob !== '' && audioRecorderBlob !== '') {
    window.open(chrome.runtime.getURL('pages/record.html'))
  }
}
