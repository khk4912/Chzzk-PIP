import type { StreamInfo } from './utils/record_stream'
import { transcode } from './utils/transcode'

async function main (): Promise<void> {
  const { recorderBlob } = await chrome.storage.local.get('recorderBlob')
  const { streamInfo } = await chrome.storage.local.get('streamInfo') as { streamInfo: StreamInfo }

  const downloadButton = document.getElementById('downloadBtn') as HTMLButtonElement
  const mp4DownloadBtn = document.getElementById('mp4DownloadBtn') as HTMLButtonElement

  const video = document.getElementById('vid') as HTMLVideoElement
  video.src = recorderBlob
  video.preload = 'metadata'

  video.addEventListener('loadedmetadata', () => {
    void (async () => {
      video.currentTime = Number.MAX_SAFE_INTEGER
      await new Promise(resolve => setTimeout(resolve, 500))
      video.currentTime = 0

      if (typeof recorderBlob !== 'string') {
        return
      }

      const fileName = `${streamInfo.streamerName}_${video.duration}s`

      downloadButton.addEventListener('click', () => {
        downloadVideo(recorderBlob, `${fileName}.webm`)
      })

      mp4DownloadBtn.addEventListener('click', () => {
        void downloadMP4Video(recorderBlob, `${fileName}.mp4`)
      })

      window.addEventListener('beforeunload', () => {
        URL.revokeObjectURL(recorderBlob)
      })
    })()
  }, { once: true })
}

function downloadVideo (recorderBlobURL: string, fileName: string): void {
  const a = document.createElement('a')
  a.href = recorderBlobURL
  a.download = fileName
  a.click()
}

async function downloadMP4Video (recorderBlobURL: string, fileName: string): Promise<void> {
  const mp4BlobURL = await transcode(recorderBlobURL)

  const a = document.createElement('a')
  a.href = mp4BlobURL
  a.download = fileName
  a.click()
}

void main()
