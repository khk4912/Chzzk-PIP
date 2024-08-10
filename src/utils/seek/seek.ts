import { getCorePlayer } from './react_helper'

// https://github.com/video-dev/hls.js/blob/master/docs/API.md

export function seek (): void {
  patchPlayer()
}

function patchPlayer (): void {
  const player = getCorePlayer()
  if (player === null) {
    return
  }

  const config = player.hls.config

  config.liveMaxLatencyDurationCount = Infinity

  config.maxBufferLength = Infinity
  config.maxBufferSize = Infinity
  config.maxBufferLength = Infinity
}
