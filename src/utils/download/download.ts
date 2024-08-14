import type { Video, VideoInfo, PlayBackURL } from '../../../types/download'

export const isVODPage = (): boolean => {
  return window.location.pathname.startsWith('/video/')
}

export const isClipPage = (): boolean => {
  return window.location.pathname.startsWith('/embed/clip/')
}

export const isClipsPage = (): boolean => {
  return window.location.pathname.startsWith('/shorts/')
}

export async function getVideoInfo (videoNumber: number): Promise<VideoInfo> {
  const r = await fetch(`https://api.chzzk.naver.com/service/v2/videos/${videoNumber}`, { credentials: 'include' })
  const data: Video = await r.json()

  const videoTitle = data.content.videoTitle
  const inKey = data.content.inKey
  const videoID = data.content.videoId
  const thumbnailURL = data.content.thumbnailImageUrl

  return { videoTitle, inKey, videoID, thumbnailURL }
}

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
