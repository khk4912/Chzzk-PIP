import { useState } from 'react'
import ScreenshotIcon from '../../static/screenshot.svg?react'
import { getOption } from '../../types/options'
import { inject } from '../inject_btn'
import { useShortcut } from '../utils/hooks'
import { saveScreenshot } from '../utils/save'
import { getStreamInfo } from '../utils/stream_info'
import { ScreenshotPreview } from './screenshot_preview'

export function ScreenshotButton (): React.ReactNode {
  const clickHandler = (): void => {
    const dataURL = screenshot()
    if (dataURL === undefined) {
      return
    }

    void saveOrPreview(dataURL)
  }
  useShortcut(['s', 'S', 'ㄴ'], clickHandler)

  return (
    <button
      className='pzp-button pzp-pc-setting-button pzp-pc__setting-button pzp-pc-ui-button chzzk-screenshot-button'
      onClick={clickHandler}
    >
      <span className='pzp-pc-ui-button__tooltip pzp-pc-ui-button__tooltip--top'>스크린샷 (s)</span>
      <span className='pzp-ui-icon pzp-pc-setting-button__icon'>
        <ScreenshotIcon />
      </span>
    </button>
  )
}

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
  const dataURL = canvas.toDataURL('image/png')

  return dataURL
}

async function saveOrPreview (dataURL: string): Promise<void> {
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
    injectPreview(dataURL, title)
  } else {
    saveScreenshot(dataURL, title)
  }
}

function injectPreview (dataURL: string, title: string): void {
  const target = document.querySelector('[class^="toolbar_container"]') ??
  document.querySelector('[class^="layout_glive"]')

  const div = document.createElement('div')
  if (target === null) {
    return
  }

  target.parentNode?.insertBefore(div, target)
  const root = inject(<ScreenshotPreview dataURL={dataURL} title={title} />, div)
}
