import type { StreamInfo } from './utils/record_stream'

async function main (): Promise<void> {
  const { recorderBlob } = await chrome.storage.local.get('recorderBlob')
  const { streamInfo } = await chrome.storage.local.get('streamInfo') as { streamInfo: StreamInfo }

  const video = document.getElementById('vid') as HTMLVideoElement
  video.src = recorderBlob

  video.addEventListener('loadedmetadata', () => {
    void (async () => {
      video.currentTime = 1e101
      await new Promise(resolve => setTimeout(resolve, 1000))
      video.currentTime = 0
      await createDownloadLink(video, recorderBlob, streamInfo)
    })()
  }, { once: true })
}

async function createDownloadLink (video: HTMLVideoElement, recorderBlob: any, streamInfo: StreamInfo): Promise<void> {
  const downloadButton = document.getElementById('downloadBtn') as HTMLButtonElement
  const videoDuration = video.duration

  downloadButton.addEventListener('click', () => {
    const a = document.createElement('a')
    a.href = recorderBlob
    a.download = `${streamInfo.streamerName}_${videoDuration}s.webm`
    a.click()
  })

  await chrome.storage.local.set({ recorderBlob: [] })
}

void main()
