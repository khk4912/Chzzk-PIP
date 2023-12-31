import { isSupportedType, type StreamInfo, type SupportedType } from './types/record'
import { transcode } from './utils/record/transcode'

async function main (): Promise<void> {
  const { recorderBlob } = await chrome.storage.local.get('recorderBlob')
  const { streamInfo } = await chrome.storage.local.get('streamInfo') as { streamInfo: StreamInfo }

  const downloadButtons: NodeListOf<HTMLButtonElement> = document.querySelectorAll('.download')

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

      downloadButtons.forEach((btn) => {
        const dataType = btn.getAttribute('data-type') ?? ''

        if (!isSupportedType(dataType)) {
          return
        }

        btn.addEventListener('click', () => {
          download(
            recorderBlob,
            `${fileName}.${dataType}`,
            dataType
          )
        })
      })

      window.addEventListener('beforeunload', () => {
        URL.revokeObjectURL(recorderBlob)
      })
    })()
  }, { once: true })
}

function download (
  recorderBlobURL: string,
  fileName: string,
  type: SupportedType = 'webm'): void {
  switch (type) {
    case 'webm':
      startDownload(recorderBlobURL, fileName)
      break
    case 'webp':
    case 'gif':
    case 'mp4':
      void donwloadAfterTranscode(recorderBlobURL, fileName, type)
      break
  }
}

function startDownload (recorderBlobURL: string, fileName: string): void {
  const a = document.createElement('a')
  a.href = recorderBlobURL
  a.download = fileName
  a.click()
}

async function donwloadAfterTranscode (
  recorderBlobURL: string,
  fileName: string,
  dataType: SupportedType
): Promise<void> {
  const transcodeBlobURL = await transcode(recorderBlobURL, dataType)

  startDownload(transcodeBlobURL, fileName)
}

void main()
