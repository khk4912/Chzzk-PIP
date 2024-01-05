import type { PlayBackURL, Video, VideoInfo } from '../../types/vod'

export function isVODPage (): boolean {
  return location.pathname.startsWith('/video')
}

export async function openDownloadVODPage (): Promise<void> {
  const videoNumber = Number(location.pathname.split('/')[2])

  const videoInfo = await getVideoInfo(videoNumber)
  const playBackURL = await getPlayBackURL(videoInfo.videoID, videoInfo.inKey)

  await chrome.storage.local.set({ playBackURL })
  await chrome.storage.local.set({ videoInfo })

  console.log(videoInfo)

  window.open(chrome.runtime.getURL('pages/download_vod.html'))
}

async function getVideoInfo (videoNumber: number): Promise<VideoInfo> {
  const r = await fetch(`https://api.chzzk.naver.com/service/v1/videos/${videoNumber}`)
  const data: Video = await r.json()

  const videoTitle = data.content.videoTitle
  const inKey = data.content.inKey
  const videoID = data.content.videoId
  const thumbnailURL = data.content.thumbnailImageUrl

  return { videoTitle, inKey, videoID, thumbnailURL }
}

async function getPlayBackURL (videoID: string, inKey: string): Promise<PlayBackURL[]> {
  const r = await fetch(`https://apis.naver.com/neonplayer/vodplay/v1/playback/${videoID}?key=${inKey}&sid=2099&env=real&lc=ko&cpl=ko`,
    {
      headers: {
        Accept: 'application/xml'
      }
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
  })

  return res
}
