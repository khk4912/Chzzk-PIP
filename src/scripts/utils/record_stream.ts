export interface Video extends HTMLMediaElement {
  captureStream: () => MediaStream
}

export interface StreamInfo {
  streamerName: string
  streamTitle: string
}

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
      videoBitsPerSecond: 8000000
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
  window.open(chrome.runtime.getURL('record.html'))
}
