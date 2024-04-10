import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'

import './download_vod.css'
import type { PlayBackURL, VideoInfo } from '../../types/vod'

const donwnloadVideo = (url: string, fileName: string): void => {
  void chrome.downloads.download({
    url,
    filename: fileName.replace(/[/\\?%*:|"<>]/g, '_')
  })
}

const Quality = ({ playBackURL, title }: { playBackURL: PlayBackURL, title: string }): JSX.Element => (
  <div className='item'>
    <span id='quality'>
      {playBackURL.resolution}p {playBackURL.fps}fps
    </span>

    <button
      className='download'
      onClick={
        () => { donwnloadVideo(playBackURL.url, title) }
      }
    >
      다운로드
    </button>
  </div>

)

function DownloadVOD (): JSX.Element {
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null)
  const [playBackURLs, setPlayBackURLs] = useState<PlayBackURL[] | null>(null)

  useEffect(() => {
    const getStorage = async (): Promise<void> => {
      const { videoInfo, playBackURL } = await chrome.storage.local.get(['videoInfo', 'playBackURL']) as { videoInfo: VideoInfo, playBackURL: PlayBackURL[] }
      setVideoInfo(videoInfo)

      playBackURL.sort((a, b) => b.resolution - a.resolution)
      setPlayBackURLs(playBackURL)
    }

    void getStorage()
  }, [])

  return (
    <>
      <span id='header'>다시보기 다운로드</span>
      <span id='vodTitle'>{videoInfo?.videoTitle ?? ''}</span>
      <img id='thumbnail' src={videoInfo?.thumbnailURL ?? ''} alt='다시보기 썸네일' />

      <div className='available-quality'>
        <div className='quality-list'>
          {
            playBackURLs?.map((x) => (
              <Quality
                key={`${x.resolution}${x.fps}`}
                playBackURL={x}
                title={videoInfo?.videoTitle ?? 'unknown'}
              />
            ))
          }
        </div>
      </div>
    </>
  )
}

const root = document.getElementById('root')
if (root !== null) {
  createRoot(root).render(
    <React.StrictMode>
      <DownloadVOD />
    </React.StrictMode>
  )
}
