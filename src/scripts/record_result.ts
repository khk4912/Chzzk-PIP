import { isSupportedType, type StreamInfo, type SupportedType } from './types/record'
import { segmentize, transcode } from './utils/record/transcode'

async function main (): Promise<void> {
  const { recorderBlob } = await chrome.storage.local.get('recorderBlob')
  const { streamInfo } = await chrome.storage.local.get('streamInfo') as { streamInfo: StreamInfo }

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
      registerDownloadHandler(recorderBlob, fileName)
      registerSegmentModalHandler(recorderBlob, fileName)
    })()
  }, { once: true })
}

function registerDownloadHandler (
  recorderBlobURL: string,
  fileName: string
): void {
  const downloadButtons: NodeListOf<HTMLButtonElement> = document.querySelectorAll('.download')
  downloadButtons.forEach((btn) => {
    const dataType = btn.getAttribute('data-type') ?? ''

    if (!isSupportedType(dataType)) {
      return
    }

    btn.addEventListener('click', () => {
      download(
        recorderBlobURL,
        `${fileName}.${dataType}`,
        dataType
      )
    })
  })

  window.addEventListener('beforeunload', () => {
    URL.revokeObjectURL(recorderBlobURL)
  })
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

function registerSegmentModalHandler (
  recorderBlobURL: string,
  fileName: string
): void {
  const segmentModal = document.querySelector('.segment-overlay')
  const segmentDownloadBtn = document.querySelector('#segmentDownloadBtn')
  const modalShowBtn = document.getElementById('showSegmentModalBtn')
  const modalHideBtn = document.getElementById('hideSegmentModalBtn')

  const showModal = (): void => {
    if (!(segmentModal instanceof HTMLDivElement)) {
      return
    }

    segmentModal.style.visibility = 'visible'
    segmentModal.style.opacity = '1'
  }

  const hideModal = (): void => {
    if (!(segmentModal instanceof HTMLDivElement)) {
      return
    }

    segmentModal.style.visibility = 'hidden'
    segmentModal.style.opacity = '0'
  }

  segmentDownloadBtn?.addEventListener('click', () => {
    void segmentDownload(recorderBlobURL, fileName)
  })
  modalShowBtn?.addEventListener('click', showModal)
  modalHideBtn?.addEventListener('click', hideModal)
}

async function segmentDownload (
  recorderBlobURL: string,
  fileName: string
): Promise<void> {
  const segmentSecInput = document.getElementById('segmentSec') as HTMLInputElement
  const sec = Number(segmentSecInput.value)

  const urls = await segmentize(recorderBlobURL, sec)

  urls.forEach((url, idx) => {
    const a = document.createElement('a')
    a.href = url
    a.download = `${fileName}_${idx}.webm`
    a.click()
  })
}

void main()
