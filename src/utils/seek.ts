const SEEK_SECONDS = 5
const FRAGMENT_DURATION = 1

export function seekLeft (video: HTMLVideoElement): void {
  if (video.buffered.length === 0) { return }

  if (video.currentTime - SEEK_SECONDS <= video.buffered.start(0)) {
    video.currentTime = video.buffered.start(0) + FRAGMENT_DURATION
  } else {
    video.currentTime -= SEEK_SECONDS
  }
}

export function seekRight (video: HTMLVideoElement): void {
  if (video.buffered.length === 0) { return }

  if (video.currentTime + SEEK_SECONDS - FRAGMENT_DURATION >= video.buffered.end(video.buffered.length - 1)) {
    video.currentTime = video.buffered.end(video.buffered.length - 1) - FRAGMENT_DURATION
  } else {
    video.currentTime += SEEK_SECONDS
  }
}
