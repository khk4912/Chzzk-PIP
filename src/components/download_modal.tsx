import ReactDOM from 'react-dom'
import { useEffect, useState } from 'react'

import style from './download_modal.module.css'
import { getVideoInfo, getPlayBackURL } from '../utils/download/download'
import type { PlayBackURL } from '../../types/download'
import { getStreamInfo } from '../utils/stream_info'
import type { DownloadMessage } from '../../types/message'

export function DownloadVODModalPortal ({ setState }: { setState: (x: boolean) => void }): React.ReactNode {
  let target = document.querySelector('#chzzk-download-modal')
  const [playbackURLs, setPlaybackURLs] = useState<PlayBackURL[]>([])

  useEffect(() => {
    const init = async (): Promise<void> => {
      const videoNumber = Number(location.pathname.split('/')[2])
      const videoInfo = await getVideoInfo(videoNumber)

      const playbackURLs = await getPlayBackURL(videoInfo.videoID, videoInfo.inKey)

      setPlaybackURLs(playbackURLs)
    }

    init().catch(console.error)
  }, [])

  if (target === null) {
    const downloadModalPortal = document.createElement('div')
    downloadModalPortal.id = 'chzzk-download-modal'
    document.body.appendChild(downloadModalPortal)

    target = document.createElement('div')
    downloadModalPortal.appendChild(target)
  }

  return ReactDOM.createPortal(<DownloadVODModal playbackURLs={playbackURLs} setState={setState} />, target)
}

/**
 * DownloadVODModal component
 *
 * VOD 다운로드를 위한 모달 컴포넌트입니다.
 */
function DownloadVODModal ({ playbackURLs, setState }: { playbackURLs: PlayBackURL[], setState: (x: boolean) => void }): React.ReactNode {
  const download = (url: string): void => {
    const streamInfo = getStreamInfo(document)
    const fileName = `${streamInfo.streamTitle}.mp4`.replace(/[/\\?%*:|"<>]/g, '_')

    // TODO: 다운로드 처리
    void chrome.runtime.sendMessage({
      type: 'download',
      data: {
        url,
        fileName
      }
    } satisfies DownloadMessage)

    setState(false)
  }

  return (
    <div className={style.modal}>
      <div className={style.modalContent}>
        <div className={style.modalHeader}>
          <h2>VOD 다운로드</h2>
          <span>다운을 원하는 동영상 화질 / 프레임을 선택해주세요.</span>
        </div>
        <div className={style.modalBody}>
          {playbackURLs.map((playbackURL) => {
            return (
              <div
                key={`${playbackURL.resolution}@${playbackURL.fps}`}
                className={style.modalItem}
                onClick={
                () => {
                  download(playbackURL.url)
                }
               }
              >
                <span id={style.quality}>{playbackURL.resolution}p {playbackURL.fps}fps</span>
              </div>
            )
          })}
        </div>
        <button id={style.closeButton} onClick={() => { setState(false) }}>닫기</button>
      </div>

    </div>
  )
}
