import { type Video, startRecord, stopRecord } from './record_stream'

export async function evtStartRecord (target: HTMLButtonElement): Promise<void> {
  const video: Video | null = document.querySelector('.webplayer-internal-video')

  const streamerName = document.querySelector("[class^='video_information'] > [class^='name_ellipsis']")?.textContent ?? 'streamer'
  const streamTitle = document.querySelector("[class^='video_information_title']")?.textContent ?? 'title'

  if (video === null) {
    return
  }

  video.addEventListener('volumechange', () => {
    if (video.muted || video.volume === 0) {
      void evtStopRecord(target, recorder)
    }
  }, { once: true })

  const recorder = await startRecord(video, { streamerName, streamTitle })

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
