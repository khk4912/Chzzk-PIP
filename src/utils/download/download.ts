import type { Video, VideoInfo, PlayBackURL } from '../../../types/download'

/*
  현재 페이지가 VOD, Clip, Shorts(새로운 클립 페이지) 페이지인지
  URL을 통해 파악합니다.
*/
export const isVODPage = (): boolean => {
  return window.location.pathname.startsWith('/video/')
}

export const isClipPage = (): boolean => {
  return window.location.pathname.startsWith('/embed/clip/')
}

export const isShortsPage = (): boolean => {
  return window.location.pathname.startsWith('/shorts/')
}

/**
 * VOD 다운로드를 위해 필요한 정보를 가져옵니다.
 *
 * @param videoNumber VOD 번호
 * @returns VOD 정보
 */
export async function getVideoInfo (videoNumber: number): Promise<VideoInfo> {
  const r = await fetch(`https://api.chzzk.naver.com/service/v2/videos/${videoNumber}`, { credentials: 'include' })
  const data: Video = await r.json()

  const videoTitle = data.content.videoTitle
  const inKey = data.content.inKey
  const videoID = data.content.videoId
  const thumbnailURL = data.content.thumbnailImageUrl

  return { videoTitle, inKey, videoID, thumbnailURL }
}

/**
 * VOD 다운로드에 사용되는 PlayBackURL을 가져옵니다.
 *
 * @param videoID VOD IDs
 * @param inKey VideoInfo에서 얻은 inKey
 * @returns PlayBackURL
 */
export async function getPlayBackURL (videoID: string, inKey: string): Promise<PlayBackURL[]> {
  const r = await fetch(`https://apis.naver.com/neonplayer/vodplay/v2/playback/${videoID}?key=${inKey}&sid=2099&env=real&lc=ko&cpl=ko`,
    {
      headers: {
        Accept: 'application/xml'
      },
      credentials: 'include'
    }
  )

  const data = new DOMParser().parseFromString(await r.text(), 'text/xml')
  const mp4AdaptionSet = data.querySelectorAll('AdaptationSet[mimeType="video/mp4"] > Representation')

  const res: PlayBackURL[] = []

  mp4AdaptionSet.forEach((rep) => {
    const fpsKind = rep.querySelector('[kind="fps"]')?.innerHTML
    const resolutionKind = rep.querySelector('[kind="resolution"]')?.innerHTML
    const baseURL = rep.querySelector('BaseURL')?.innerHTML

    if (fpsKind === undefined ||
        resolutionKind === undefined ||
        baseURL === undefined) {
      return
    }

    res.push({
      resolution: parseInt(resolutionKind),
      fps: parseInt(fpsKind),
      url: baseURL
    })
    // Sort with resolution
    res.sort((a, b) => b.resolution - a.resolution)
  })

  return res
}
