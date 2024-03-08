import { injectOverlay, removeOverlay, updateOverlay } from '../inject/rec_overlay'
import { startRecord, stopRecord } from './record_stream'
import type { Video } from '../../types/record'
import { getStreamInfo } from '../stream_info'
import { getOption } from '../options/option_handler'

export function startRecordListener (e: Event): void {
  (async (): Promise<void> => {
    const video: Video | null = document.querySelector('.webplayer-internal-video')
    if (video === null) {
      return
    }

    const { highFrameRateRec } = await getOption()

    if (highFrameRateRec) {
      await _highFrameRateRec(video)
    }

    await _record(video)
  })()
    .then()
    .catch(() => {
      initRecordButton()
    })
}

async function _record (video: Video): Promise<void> {
  const streamInfo = getStreamInfo(document)
  const recorder = await startRecord(video, streamInfo)

  const recordSVG = document.querySelector('#chzzk-rec-icon')
  recordSVG?.setAttribute('fill', 'red')

  // inject Overlay
  let sec = 0

  injectOverlay()
  updateOverlay(sec++)

  const oldHref = window.location.href

  const overlayInterval = setInterval(() => {
    if (oldHref !== window.location.href) {
      stopRecordListener(recorder, overlayInterval, videoWatcherInterval)
      return
    }
    updateOverlay(sec++)
  }, 1000)

  const videoWatcherInterval = setInterval(() => {
    const video = document.querySelector('.webplayer-internal-video')
    if (video === null) {
      stopRecordListener(recorder, overlayInterval, videoWatcherInterval)
    }
  }, 1000)

  // Add stop EventListener
  const recordButton = document.querySelector('.chzzk-record-button')
  recordButton?.addEventListener('click', () => {
    stopRecordListener(recorder, overlayInterval, videoWatcherInterval)
  }, { once: true })
}

async function _highFrameRateRec (video: Video): Promise<void> {

}

export function stopRecordListener (
  recorder: MediaRecorder,
  overlayIntervalID: NodeJS.Timeout,
  videoWatcherIntervalID: NodeJS.Timeout
): void {
  (async (): Promise<void> => {
    // TODO: Remove volume watcher
    const recordButton = document.querySelector('.chzzk-record-button')
    clearEventListeners(recordButton)
    await stopRecord(recorder)

    const recordSVG = document.querySelector('#chzzk-rec-icon')
    recordSVG?.setAttribute('fill', '#ffffff')

    const clonedBtn = document.querySelector('.chzzk-record-button')

    // claer Overlay
    clearInterval(overlayIntervalID)
    removeOverlay()

    // Add start EventListener
    clonedBtn?.addEventListener('click', startRecordListener, { once: true })

    // clear video watcher
    clearInterval(videoWatcherIntervalID)
  })()
    .then()
    .catch(console.error)
}

function clearEventListeners (target: Element | null): void {
  if (target === null) {
    return
  }

  const clone = target.cloneNode(true)
  if (clone instanceof Element) {
    target.replaceWith(clone)
  }
}

function initRecordButton (): void {
  const recordSVG = document.querySelector('#chzzk-rec-icon')
  recordSVG?.setAttribute('fill', '#ffffff')

  // Add start EventListener
  const recordButton = document.querySelector('.chzzk-record-button')
  recordButton?.addEventListener('click', startRecordListener, { once: true })
}
