import React, { useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'

import ScreenshotIcon from '../../static/screenshot.svg?react'
import { getOption } from '../../types/options'
import { useShortcut } from '../utils/hooks'
import { getStreamInfo } from '../utils/stream_info'

import { download } from '../utils/download/clip'
import { DraggablePreviewPortal } from './draggable_preview'

interface ScreenshotInfo {
  dataURL: string
  fileName: string
}

export function ScreenShotPortal ({ tg }: { tg: Element | undefined }): React.ReactNode {
  if (tg === undefined) {
    return null
  }

  const div = document.createElement('div')
  div.id = 'chzzk-pip-screenshot-button'

  tg.insertBefore(div, tg.firstChild)
  return ReactDOM.createPortal(<ScreenshotButton />, div)
}

/**
 * ScreenshotButton component
 *
 * 스크린샷 버튼 컴포넌트입니다.
 */
function ScreenshotButton (): React.ReactNode {
  const [portals, setPortals] = useState<React.ReactNode[]>([])

  const isPreviewOn = useRef(false) // 이미지 미리보기 옵션 활성화 여부
  const screeshotInfo = useRef<ScreenshotInfo>({ dataURL: '', fileName: '' })

  const clickHandler = (): void => {
    const dataURL = screenshot()
    if (dataURL === undefined) {
      return
    }

    saveOrPreview(dataURL, screeshotInfo)
      .then((preview) => {
        if (preview) {
          const id = new Date().getTime()

          setPortals(
            (prev) =>
              [...prev,
                <DraggablePreviewPortal
                  imageURL={screeshotInfo.current.dataURL}
                  fileName={screeshotInfo.current.fileName}
                  idx={id}
                  setPortal={setPortals}
                  key={id}
                />
              ]
          )
        }
      })
      .catch(console.error)
  }

  useEffect(() => {
    void getOption()
      .then(
        (option) => {
          option.screenshotPreview = isPreviewOn.current
        })
      .catch(console.error)
  }, [])

  useShortcut(['s', 'S', 'ㄴ'], clickHandler)

  return (
    <>
      <button
        className='pzp-button pzp-pc-setting-button pzp-pc__setting-button pzp-pc-ui-button chzzk-screenshot-button'
        onClick={clickHandler}
      >
        <span className='pzp-pc-ui-button__tooltip pzp-pc-ui-button__tooltip--top'>스크린샷 (S)</span>
        <span className='pzp-ui-icon pzp-pc-setting-button__icon'>
          <ScreenshotIcon />
        </span>
      </button>

      {portals.map((portal, idx) => (
        <React.Fragment key={idx}>{portal}</React.Fragment>
      ))}
    </>
  )
}

/**
 * 스트림 화면을 스크린샷 합니다.
 *
 * @returns 스크린샷 이미지 dataURL (Base64)
 */
function screenshot (): string | undefined {
  const video: HTMLVideoElement | null = document.querySelector('.webplayer-internal-video')
  if (video === null) {
    return
  }

  const canvas = document.createElement('canvas')
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight

  const ctx = canvas.getContext('2d')

  if (ctx === null) {
    console.error('Failed to get 2d context, cannot take a screenshot')
    return
  }

  ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
  return canvas.toDataURL('image/png')
}

/**
 * 설정에 따라 이미지 미리보기를 표시하거나 즉시 다운로드합니다.
 *
 * @param dataURL 스크린샷 이미지 dataURL (Base64)
 */

async function saveOrPreview (dataURL: string, infoRef: React.MutableRefObject<ScreenshotInfo>): Promise<boolean> {
  const { screenshotPreview } = await getOption()
  const info = getStreamInfo(document)
  const yyyymmddhhmmss = (date: Date): string => {
    const yyyy = date.getFullYear()
    const mm = String(date.getMonth() + 1).padStart(2, '0')
    const dd = String(date.getDate()).padStart(2, '0')
    const hh = String(date.getHours()).padStart(2, '0')
    const mi = String(date.getMinutes()).padStart(2, '0')
    const ss = String(date.getSeconds()).padStart(2, '0')

    return `${yyyy}${mm}${dd}${hh}${mi}${ss}`
  }

  const title = `${info.streamerName}_${info.streamTitle.replace(/[/\\?%*:|"<>]/g, '_')}}_${yyyymmddhhmmss(new Date())}`

  if (screenshotPreview) {
    infoRef.current = { dataURL, fileName: `${title}` }
    return true
  }

  void download(dataURL, `${title}`, 'png')
  return false
}
