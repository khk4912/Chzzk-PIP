export interface Video extends HTMLMediaElement {
  captureStream: () => MediaStream
}

const checkIsMuted = (video: Video): boolean => {
  return video.muted || video.volume === 0
}

export async function startRecord (video: Video): Promise<MediaRecorder> {
  const isMuted = checkIsMuted(video)

  if (isMuted) {
    video.muted = false
    video.volume = 0.5
  }

  const stream = video.captureStream()
  const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' })

  const chunks: Blob[] = []
  await chrome.storage.local.set({ recorderBlob: [] })

  recorder.ondataavailable = async (event) => {
    if (event.data.size === 0) return

    chunks.push(event.data)
    await chrome.storage.local.set({ recorderBlob: chunks })
  }

  recorder.start()
  return recorder
}

export async function stopRecord (recorder: MediaRecorder): Promise<string> {
  recorder.stop()

  const { recorderBlob } = await chrome.storage.local.get('recorderBlob')
  const url = URL.createObjectURL(new Blob(recorderBlob as Blob[]))

  // await chrome.storage.local.set({ recorderBlob: [] })
  await openRecordWindow(url)

  return url
}

async function openRecordWindow (url: string): Promise<void> {
  // open record.html in a new window
  window.open(chrome.runtime.getURL('record.html'))
}
