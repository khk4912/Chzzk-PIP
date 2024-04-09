import type { StreamInfo } from '../../types/record'

export const getStreamInfo = (document: Document): StreamInfo => {
  const streamerName = document.querySelector("[class^='video_information'] > [class^='name_ellipsis'] > [class^='name_text']")?.textContent ??
                       document.querySelector("[class^='live_information'] > [class^='name_ellipsis']> [class^='name_text']")?.textContent ??
                       'title'

  const streamTitle = document.querySelector("[class^='video_information_title']")?.textContent ??
                      document.querySelector("[class^='live_information_player_title']")?.textContent ??
                      'streamer'

  return { streamerName, streamTitle }
}
