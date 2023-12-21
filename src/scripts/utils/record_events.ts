import { type Video, startRecord, stopRecord } from './record_stream'

export async function evtStartRecord (target: HTMLButtonElement): Promise<void> {
  const video = document.querySelector('.webplayer-internal-video')

  const streamerName = document.querySelector("[class^='video_information'] > [class^='name_ellipsis']")?.textContent ?? 'streamer'
  const streamTitle = document.querySelector("[class^='video_information_title']")?.textContent ?? 'title'

  if (video === null) {
    return
  }

  const recorder = await startRecord(video as Video, { streamerName, streamTitle })

  const svg = document.querySelector('#chzzk-rec-icon')
  svg?.setAttribute('fill', 'red')
  target.addEventListener('click', (e) => {
    void evtStopRecord(e.target as HTMLButtonElement, recorder)
  }, { once: true })
}

async function evtStopRecord (target: HTMLButtonElement, recorder: MediaRecorder): Promise<void> {
  await stopRecord(recorder)

  target.addEventListener('click', (e) => {
    void evtStartRecord(e.target as HTMLButtonElement)
  }, { once: true })

  const svg = document.querySelector('#chzzk-rec-icon')
  svg?.setAttribute('fill', '#ffffff')
}
