import { getCorePlayer } from './utils/seek/react_helper'

// TODO: https://github.com/video-dev/hls.js/blob/master/docs/API.md 보고 연구해보기

(() => {
  const player = getCorePlayer()
  const hls = player.player._mediaController._hls

  hls.config.backBufferLength = Infinity // 브라우저에게 관리 맡기기
})()
