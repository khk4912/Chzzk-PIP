import type { Video, StreamInfo } from '../types/record'
import type { Option } from '../types/option'

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
      mimeType: 'video/webm',
      videoBitsPerSecond: 7000000
    }
  )

  await chrome.storage.local.set({ recorderBlob: '', streamInfo })

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

  const option: Option = (await chrome.storage.local.get('option'))?.option ?? {}

  const fastRec = option?.fastRec ?? false
  if (!fastRec) {
    window.open(chrome.runtime.getURL('pages/record.html'))
    return
  }

  const { recorderBlob } = await chrome.storage.local.get('recorderBlob')
  const { streamInfo } = await chrome.storage.local.get('streamInfo') as { streamInfo: StreamInfo }

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

      const fileName = `${streamInfo.streamerName}_${video.duration}s`

      const a = document.createElement('a')
      a.href = recorderBlob
      a.download = `${fileName}.webm`

      a.click()
    })()
  })
}
