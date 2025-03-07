import type { PlayBackURL, Clip, ContentInfo } from '../../../types/download'
import type { DownloadMessage } from '../../../types/message'
import { sanitizeFileName } from '../record/save'

// https://apis.naver.com/neonplayer/vodplay/v1/playback/185E84C6EEAC13828C3A6ADFD10800810E81?key=V1257d3d223e05ce67f809b5051667aa86f181e3ae1c23455289eccb2031fde8a47809b5051667aa86f18&sid=2113&env=real&lc=ko&cpl=ko

/**
 * 클립의 정보 (contentID, inKey, contentTitle)를 가져옵니다.
 *
 * @param videoID 클립의 ID
 * @returns 클립의 정보 (contentID, inKey, contentTitle)
 */
export async function getClipInfo (videoID: string): Promise<ContentInfo> {
  const r = await fetch(`https://api.chzzk.naver.com/service/v1/play-info/clip/${videoID}`, { credentials: 'include' })
  const data = await r.json() as Clip

  const contentTitle = data.content.contentTitle
  const inKey = data.content.inKey
  const contentID = data.content.videoId

  return { contentID, inKey, contentTitle }
}

/**
 * 다운로드에 사용되는 PlayBackURL을 가져옵니다.
 *
 * @param contentID 다운로드할 컨텐츠의 ID
 * @param inKey getInfo에서 얻은 inKey
 * @returns PlayBackURL
 */
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

const isMoz = navigator.userAgent.includes('Firefox')
/**
 * URL의 파일을 다운로드 하기 위해 Worker에 다운로드 요청 메시지를 보냅니다.
 * (Firefox에서는 a 태그를 사용하여 다운로드 합니다.)
 *
 * @param url 다운로드할 파일의 URL
 * @param title 다운로드할 파일의 이름
 * @param ext 다운로드할 파일의 확장자 (optional)
 */
export async function download (url: string, title: string, ext?: string): Promise<void> {
  if (isMoz) {
    const a = document.createElement('a')
    a.href = url
    a.download = sanitizeFileName(`${title.trim()}.${ext ?? 'mp4'}`)
    a.click()
    return
  }

  await chrome.runtime.sendMessage(
    {
      type: 'download',
      data: {
        url,
        fileName: sanitizeFileName(`${title.trim()}.${ext ?? 'mp4'}`)
      }
    } satisfies DownloadMessage
  )
}

/**
 * 클립을 다운로드 합니다.
 * id가 주어지지 않으면 현재 페이지의 URL에서 ID를 추출하여 사용합니다.
 *
 * @param id 다운로드할 클립의 ID (optional)
 */
export async function downloadClip (id?: string): Promise<void> {
  const videoID = id ?? location.pathname.split('/')[3]

  const contentInfo = await getClipInfo(videoID)
  const playBackURL = await getPlayBackURL(contentInfo.contentID, contentInfo.inKey)

  await download(playBackURL.url, contentInfo.contentTitle)
}
