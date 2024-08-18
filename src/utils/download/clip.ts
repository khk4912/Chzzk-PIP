import type { PlayBackURL, Clip, ContentInfo } from '../../../types/download'
import type { DownloadMessage } from '../../../types/message'

// https://apis.naver.com/neonplayer/vodplay/v1/playback/185E84C6EEAC13828C3A6ADFD10800810E81?key=V1257d3d223e05ce67f809b5051667aa86f181e3ae1c23455289eccb2031fde8a47809b5051667aa86f18&sid=2113&env=real&lc=ko&cpl=ko

export async function getClipInfo (videoID: string): Promise<ContentInfo> {
  const r = await fetch(`https://api.chzzk.naver.com/service/v1/play-info/clip/${videoID}`, { credentials: 'include' })
  const data: Clip = await r.json()

  const contentTitle = data.content.contentTitle
  const inKey = data.content.inKey
  const contentID = data.content.videoId

  return { contentID, inKey, contentTitle }
}

export async function getPlayBackURL (contentID: string, inKey: string): Promise<PlayBackURL> {
  const r = await fetch(`https://apis.naver.com/neonplayer/vodplay/v1/playback/${contentID}?key=${inKey}&sid=2113&env=real&lc=ko&cpl=ko`,
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
  })

  return res[0]
}

export async function download (url: string, title: string, ext?: string): Promise<void> {
  await chrome.runtime.sendMessage(
    {
      type: 'download',
      data: {
        url,
        fileName: `${title.replace(/[/\\?%*:|"<>]/g, '_')}.${ext ?? 'mp4'}`
      }
    } satisfies DownloadMessage
  )
}

export async function downloadClip (id?: string): Promise<void> {
  const videoID = id ?? location.pathname.split('/')[3]

  const contentInfo = await getClipInfo(videoID)
  const playBackURL = await getPlayBackURL(contentInfo.contentID, contentInfo.inKey)

  await download(playBackURL.url, contentInfo.contentTitle)
}
