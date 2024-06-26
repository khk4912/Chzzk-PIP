import { isSupportedType, type StreamInfo, type SupportedType } from './types/record'
import { getFrame, hideLoadBar, mergeVideoWithAudio, segmentize, showUploadBar, slice, transcode, updateUploadBar } from './utils/record/transcode'
import { upload } from './utils/upload/upload'

async function main (): Promise<void> {
  const { highFrame } = await chrome.storage.local.get('highFrame') as { highFrame: boolean }

  if (highFrame) {
    await highFrameInit()
    return
  }

  await init()
}

async function blobToBase64 (blob: Blob): Promise<string | ArrayBuffer | null> {
  return await new Promise(resolve => {
    const reader = new FileReader()
    reader.onloadend = () => { resolve(reader.result) }
    reader.readAsDataURL(blob)
  })
}

async function init (): Promise<void> {
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

  if (navigator.userAgent.includes('Firefox')) {
    chrome.runtime.onMessage.addListener((message) => {
      const blob = message.blob
      if (blob instanceof Blob) {
        void (async () => {
          const url = URL.createObjectURL(blob)
          _showVideo(url, recorderStopTime, recorderStartTime, streamInfo)
        })()
      }
    })
    return
  }

  _showVideo(recorderBlob, recorderStopTime, recorderStartTime, streamInfo)
}

function _showVideo (
  recorderBlob: string,
  recorderStopTime: number,
  recorderStartTime: number,
  streamInfo: StreamInfo
): void {
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
      registerDownloadAfterSliceHandler(recorderBlob, fileName, duration)
      registerUploadHandler(recorderBlob, duration)
    })()
  }, { once: true })
}

async function highFrameInit (): Promise<void> {
  const {
    videoRecorderBlob,
    audioRecorderBlob,
    streamInfo,
    recorderStartTime,
    recorderStopTime
  } = await chrome.storage.local.get(
    [
      'videoRecorderBlob',
      'audioRecorderBlob',
      'streamInfo',
      'recorderStartTime',
      'recorderStopTime'
    ]) as {
    videoRecorderBlob: string
    audioRecorderBlob: string
    streamInfo: StreamInfo
    recorderStartTime: number
    recorderStopTime: number
  }

  const videoURL = await mergeVideoWithAudio(videoRecorderBlob, audioRecorderBlob)
  _showVideo(videoURL, recorderStopTime, recorderStartTime, streamInfo)
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

const showModal = (modal: HTMLDivElement): void => {
  modal.style.visibility = 'visible'
  modal.style.opacity = '1'
}

const hideModal = (modal: HTMLDivElement): void => {
  modal.style.visibility = 'hidden'
  modal.style.opacity = '0'
}

function registerSegmentModalHandler (
  recorderBlobURL: string,
  fileName: string,
  originalVideoDuration: number
): void {
  const segmentModal = document.querySelector('#segmentOverlay')
  const segmentDownloadBtn = document.querySelector('#segmentDownloadBtn')
  const modalShowBtn = document.getElementById('showSegmentModalBtn')
  const modalHideBtn = document.getElementById('hideSegmentModalBtn')
  const segmentSecInput = document.getElementById('segmentSec') as HTMLInputElement

  if (!(segmentModal instanceof HTMLDivElement)) {
    return
  }

  segmentDownloadBtn?.addEventListener('click', () => {
    const parsedSecInput = Number(segmentSecInput.value)

    if (Number.isNaN(parsedSecInput) || parsedSecInput <= 0) {
      return
    }

    hideModal(segmentModal)
    void segmentDownload(recorderBlobURL, fileName, originalVideoDuration)
  })
  modalShowBtn?.addEventListener('click', () => {
    segmentSecInput.value = String(Math.floor(originalVideoDuration))
    showModal(segmentModal)
  })
  modalHideBtn?.addEventListener('click', () => {
    hideModal(segmentModal)
  })
}

function registerDownloadAfterSliceHandler (
  recorderBlobURL: string,
  fileName: string,
  originalVideoDuration: number
): void {
  const sliceModal = document.querySelector('#sliceOverlay')
  const sliceDownloadBtn = document.querySelector('#sliceDownloadBtn')
  const modalShowBtn = document.getElementById('showSliceModalBtn')
  const modalHideBtn = document.getElementById('hideSliceModalBtn')

  const sliceStart = document.getElementById('sliceStart') as HTMLInputElement
  const sliceEnd = document.getElementById('sliceEnd') as HTMLInputElement

  if (!(sliceModal instanceof HTMLDivElement)) {
    return
  }

  sliceDownloadBtn?.addEventListener('click', () => {
    const parsedStartSecInput = Number(sliceStart.value)
    const parsedEndSecInput = Number(sliceEnd.value)

    if ((Number.isNaN(parsedStartSecInput) || parsedStartSecInput <= 0) ||
        (Number.isNaN(parsedEndSecInput) || parsedEndSecInput <= 0)) {
      return
    }

    hideModal(sliceModal)
    console.log('sliceDownload called')
    void sliceDownload(recorderBlobURL, fileName, parsedStartSecInput, parsedEndSecInput)
  })
  modalShowBtn?.addEventListener('click', () => {
    sliceEnd.value = String(Math.floor(originalVideoDuration))
    showModal(sliceModal)
  })
  modalHideBtn?.addEventListener('click', () => {
    hideModal(sliceModal)
  })
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

async function sliceDownload (
  recorderBlobURL: string,
  fileName: string,
  sliceStart: number,
  sliceEnd: number
): Promise<void> {
  const url = await slice(recorderBlobURL, sliceStart, sliceEnd - sliceStart)

  const a = document.createElement('a')
  a.href = url
  a.download = `${fileName}_trim_${sliceEnd - sliceStart}s.mp4`
  a.click()
}

function registerUploadHandler (recorderBlobURL: string, duration: number): void {
  const uploadBtn = document.getElementById('uploadBtn') as HTMLButtonElement
  const uploadOverlay = document.getElementById('uploadOverlay') as HTMLDivElement
  const hideModalBtn = document.getElementById('hideUploadModalBtn')

  const urlCopy = document.getElementById('urlCopy') as HTMLDivElement
  const uploadedURL = document.getElementById('uploadedURL') as HTMLSpanElement
  const copyBtn = document.getElementById('copyBtn') as HTMLButtonElement

  hideModalBtn?.addEventListener('click', () => {
    hideModal(uploadOverlay)
  })

  uploadBtn?.addEventListener('click', () => {
    void (async () => {
      const ss = await fetch(recorderBlobURL).then(async res => await res.blob())

      if (duration < 3) {
        alert('3초 이상의 영상만 업로드할 수 있어요.')
        return
      }

      if (ss.size > 50 * 1024 * 1024) {
        alert('파일 사이즈가 너무 커서 업로드할 수 없어요.\n최대 업로드 가능 용량은 50MB입니다.')
        return
      }

      urlCopy.style.visibility = 'hidden'
      uploadedURL.innerText = ''

      const mp4 = await transcode(recorderBlobURL, 'mp4', duration)
      const thumbnail = await getFrame(recorderBlobURL)

      hideLoadBar()
      showUploadBar()

      updateUploadBar(0)
      showModal(uploadOverlay)

      const blob = await fetch(mp4).then(async res => await res.blob())
      const thumbBlob = await fetch(thumbnail).then(async res => await res.blob())

      const thumbURL = await blobToBase64(thumbBlob)

      const res = await upload(blob, thumbURL as string).catch(() => {
        alert('업로드 중 오류가 발생했어요.')
        hideModal(uploadOverlay)

        return { key: '' }
      })
      const url = `https://clips.kosame.dev/${res.key}`

      uploadedURL.innerText = url
      copyBtn.onclick = () => {
        void navigator.clipboard.writeText(url)
        alert('클립 주소가 복사되었어요.')
      }
      urlCopy.style.visibility = 'visible'
    })()
  })
}

void main()
