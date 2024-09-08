import './short.css'

import React, { useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'

import { waitForElement } from '../inject_btn'
import DownloadIcon from '../../static/download.svg?react'
import { download } from '../utils/download/clip'

/**
 * ClipsDownloadButton component
 *
 * 클립 다운로드에 사용되는 컴포넌트입니다.
 */
export function ClipsDownloadButton (): React.ReactNode {
  const onClick = (): void => {
    const url = document.querySelector('video')?.getAttribute('src')
    const sectionInfo = self.current?.closest('div.section_info')

    const title = sectionInfo?.querySelector('.si_desc_box > p.si_desc')?.innerHTML

    if (url === null || url === undefined) {
      return
    }

    download(url, title ?? 'clip').catch(console.error)
  }

  const self = useRef<HTMLButtonElement>(null)

  return (
    <button
      className='si_btn'
      onClick={onClick}
      id='downloadBtn'
      type='button'
      ref={self}
    >
      <span className='si_ico'><DownloadIcon /></span>
      <span className='si_text'>다운로드</span>
    </button>
  )
}

export function ClipsDownloadButtonPortal (): React.ReactNode {
  const [target, setTarget] = useState<Element | undefined>(undefined)

  useEffect(() => {
    waitForElement('.si_tool_box')
      .then((x) => {
        const div = document.createElement('div')
        div.id = 'chzzk-pip-shorts-download-button'

        const tg = x as HTMLElement
        tg.insertBefore(div, tg.firstChild)

        setTarget(div)
      })
      .catch(() => {
        console.log('Failed to find target element')
      })
  }, [])

  useEffect(() => {
    return () => {
      if (target !== undefined) {
        target.remove()
      }
    }
  }, [target])

  return (
    <>
      {target !== undefined && ReactDOM.createPortal(<ClipsDownloadButton />, target)}
    </>
  )
}
