import type { StreamInfo } from './utils/record_stream'
import { transcode } from './utils/transcode'

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

      if (typeof recorderBlob === 'string') {
        await createDownloadLink(video, recorderBlob, streamInfo)

        const mp4DonwloadBtn = document.getElementById('mp4DownloadBtn') as HTMLButtonElement
        mp4DonwloadBtn.addEventListener('click', () => { void transcodeAndDownload(video, recorderBlob, streamInfo) })
      }
    })()
  }, { once: true })
}

async function createDownloadLink (video: HTMLVideoElement, recorderBlobURL: string, streamInfo: StreamInfo): Promise<void> {
  const downloadButton = document.getElementById('downloadBtn') as HTMLButtonElement
  const videoDuration = video.duration

  downloadButton.addEventListener('click', () => {
    const a = document.createElement('a')
    a.href = recorderBlobURL
    a.download = `${streamInfo.streamerName}_${videoDuration}s.webm`
    a.click()
  })
}

async function transcodeAndDownload (video: HTMLVideoElement, recorderBlobURL: string, streamInfo: StreamInfo): Promise<void> {
  const videoDuration = video.duration

  const mp4BlobURL = await transcode(recorderBlobURL)

  const a = document.createElement('a')
  a.href = mp4BlobURL
  a.download = `${streamInfo.streamerName}_${videoDuration}s.mp4`
  a.click()
}

void main()
