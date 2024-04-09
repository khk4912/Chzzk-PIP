import type { PlayBackURL, VideoInfo } from '../types/vod'

async function main (): Promise<void> {
  const { videoInfo, playBackURL } = await chrome.storage.local.get(['videoInfo', 'playBackURL']) as { videoInfo: VideoInfo, playBackURL: PlayBackURL[] }

  const thumbnailImg = document.getElementById('thumbnail') as HTMLImageElement
  thumbnailImg.src = videoInfo.thumbnailURL

  const videoTitle = document.getElementById('vodTitle') as HTMLSpanElement
  videoTitle.innerText = videoInfo.videoTitle

  createItem(playBackURL, videoInfo.videoTitle)
}

function createItem (playBackURLs: PlayBackURL[], title: string): void {
  const qualityList = document.getElementById('qualityList') as HTMLDivElement

  const donwnloadVideo = (url: string, fileName: string): void => {
    void chrome.downloads.download({
      url,
      filename: fileName.replace(/[/\\?%*:|"<>]/g, '_')
    })
  }

  playBackURLs.sort((a, b) => b.resolution - a.resolution)
  playBackURLs.forEach(
    (x) => {
      const item = document.createElement('div')
      item.classList.add('item')

      const quality = document.createElement('span')
      quality.id = 'quality'
      quality.innerText = `${x.resolution}p ${x.fps}fps`

      const download = document.createElement('button')
      download.classList.add('download')
      download.innerText = '다운로드'
      download.addEventListener('click', () => {
        donwnloadVideo(x.url, `${title} ${quality.innerText}.mp4`)
      })

      item.appendChild(quality)
      item.appendChild(download)

      qualityList.appendChild(item)
    }
  )
}

void main()
