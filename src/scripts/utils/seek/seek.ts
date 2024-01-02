import { waitForElement } from '../inject/inject_btns'
import { injectWithTimeout, seekOverlayLeft, seekOverlayRight } from '../inject/seek_overlay'
import { getOption } from '../options/option_handler'

const FRAGMENT_DURATION = 1.96
const SEEK_SECONDS = 5

export async function registerSeekHandler (): Promise<void> {
  const { seek } = await getOption()

  if (!seek) {
    return
  }

  const video = await waitForElement('.webplayer-internal-video')

  if (!(video instanceof HTMLVideoElement)) {
    return
  }

  document.addEventListener('keydown', (e) => {
    const activeElement = document.activeElement

    if (activeElement instanceof HTMLInputElement ||
      activeElement instanceof HTMLTextAreaElement ||
      activeElement instanceof HTMLPreElement) {
      return
    }

    const video = document.querySelector('.webplayer-internal-video')

    if (!(video instanceof HTMLVideoElement)) {
      return
    }

    if (video.buffered.length === 0) {
      return
    }

    if (e.key === 'ArrowLeft') {
      seekLeft(video)
    } else if (e.key === 'ArrowRight') {
      seekRight(video)
    }
  })
}

function seekLeft (video: HTMLVideoElement): void {
  void injectWithTimeout(seekOverlayLeft, 1000)

  if (video.currentTime - SEEK_SECONDS <= video.buffered.start(0)) {
    video.currentTime = video.buffered.start(0) + FRAGMENT_DURATION
  } else {
    video.currentTime -= SEEK_SECONDS
  }
}

function seekRight (video: HTMLVideoElement): void {
  void injectWithTimeout(seekOverlayRight, 1000)

  if (video.currentTime + SEEK_SECONDS - FRAGMENT_DURATION >= video.buffered.end(video.buffered.length - 1)) {
    video.currentTime = video.buffered.end(video.buffered.length - 1) - FRAGMENT_DURATION
  } else {
    video.currentTime += SEEK_SECONDS
  }
}
