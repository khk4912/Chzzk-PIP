import { isSupportedType, type StreamInfo, type SupportedType } from './types/record'
import { hideLoadBar, segmentize, transcode } from './utils/record/transcode'

async function main (): Promise<void> {
  const {
    recorderBlob,
    streamInfo,
    recorderStartTime,
    recorderStopTime
  } = await chrome.storage.local.get(
    [
      'recorderBlob',
      'streamInfo',
      'recorderStartTime',
      'recorderStopTime'
    ]) as {
    recorderBlob: string
    streamInfo: StreamInfo
    recorderStartTime: number
    recorderStopTime: number
  }

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

      let duration = video.duration
      if (duration === Infinity) {
        duration = (recorderStopTime - recorderStartTime) / 1000 - 0.1
      }

      const fileName = `${streamInfo.streamerName}_${duration}s`
      registerDownloadHandler(recorderBlob, fileName, duration)
      registerSegmentModalHandler(recorderBlob, fileName, duration)
    })()
  }, { once: true })
}

function registerDownloadHandler (
  recorderBlobURL: string,
  fileName: string,
  originalVideoDuration: number
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
        `${fileName}.${dataType === 'mp4-aac' ? 'mp4' : dataType}`,
        dataType,
        originalVideoDuration
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
  type: SupportedType = 'webm',
  originalVideoDuration: number): void {
  if (type === 'webm') {
    startDownload(recorderBlobURL, fileName)
    return
  }

  void donwloadAfterTranscode(recorderBlobURL, fileName, type, originalVideoDuration)
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
  dataType: SupportedType,
  originalVideoDuration: number
): Promise<void> {
  const transcodeBlobURL = await transcode(recorderBlobURL, dataType, originalVideoDuration)
  hideLoadBar()

  startDownload(transcodeBlobURL, fileName)
}

function registerSegmentModalHandler (
  recorderBlobURL: string,
  fileName: string,
  originalVideoDuration: number
): void {
  const segmentModal = document.querySelector('.segment-overlay')
  const segmentDownloadBtn = document.querySelector('#segmentDownloadBtn')
  const modalShowBtn = document.getElementById('showSegmentModalBtn')
  const modalHideBtn = document.getElementById('hideSegmentModalBtn')
  const segmentSecInput = document.getElementById('segmentSec') as HTMLInputElement

  const showModal = (): void => {
    if (!(segmentModal instanceof HTMLDivElement)) {
      return
    }

    segmentSecInput.value = String(Math.floor(originalVideoDuration))

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
    const parsedSecInput = Number(segmentSecInput.value)

    if (Number.isNaN(parsedSecInput) || parsedSecInput <= 0) {
      return
    }

    hideModal()
    void segmentDownload(recorderBlobURL, fileName, originalVideoDuration)
  })
  modalShowBtn?.addEventListener('click', showModal)
  modalHideBtn?.addEventListener('click', hideModal)
}

async function segmentDownload (
  recorderBlobURL: string,
  fileName: string,
  originalVideoDuration: number
): Promise<void> {
  const segmentSecInput = document.getElementById('segmentSec') as HTMLInputElement
  const sec = Number(segmentSecInput.value)

  const urls = await segmentize(recorderBlobURL, sec, originalVideoDuration)

  urls.forEach((url, idx) => {
    const a = document.createElement('a')
    a.href = url
    a.download = `${fileName}_${idx}.mp4`
    a.click()
  })
}

void main()
