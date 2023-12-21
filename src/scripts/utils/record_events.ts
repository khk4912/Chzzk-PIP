import { type Video, startRecord, stopRecord } from './record_stream'

export function startRecordListener (e: Event): void {
  (async (): Promise<void> => {
    const video: Video | null = document.querySelector('.webplayer-internal-video')
    if (video === null) {
      return
    }

    const streamerName = document.querySelector("[class^='video_information'] > [class^='name_ellipsis']")?.textContent ?? 'streamer'
    const streamTitle = document.querySelector("[class^='video_information_title']")?.textContent ?? 'title'

    const recorder = await startRecord(video, { streamerName, streamTitle })

    const recordSVG = document.querySelector('#chzzk-rec-icon')
    recordSVG?.setAttribute('fill', 'red')

    // Add stop EventListener
    const recordButton = document.querySelector('.chzzk-record-button')
    recordButton?.addEventListener('click', () => { stopRecordListener(recorder) }, { once: true })
  })()
    .then()
    .catch(() => {
      initRecordButton()
    })
}

export function stopRecordListener (recorder: MediaRecorder): void {
  (async (): Promise<void> => {
    // TODO: Remove volume watcher
    const recordButton = document.querySelector('.chzzk-record-button')
    clearEventListeners(recordButton)
    await stopRecord(recorder)

    const recordSVG = document.querySelector('#chzzk-rec-icon')
    recordSVG?.setAttribute('fill', '#ffffff')

    const clonedBtn = document.querySelector('.chzzk-record-button')
    // Add start EventListener
    clonedBtn?.addEventListener('click', startRecordListener, { once: true })
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
