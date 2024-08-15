import './short.css'

import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'

import { waitForElement } from '../inject_btn'
import DownloadIcon from '../../static/download.svg?react'
import { downloadClip } from '../utils/download/clip'
// import { download } from '../utils/download/clip'

export function ClipsDownloadButton (): React.ReactNode {
  const onClick = (): void => {
    const id = window.location.pathname.split('/').pop()

    if (id === undefined) {
      return
    }

    void downloadClip(id)
  }

  return <button onClick={onClick} id='downloadBtn' type='button'><DownloadIcon /></button>
}

export function ClipsDownloadButtonPortal (): React.ReactNode {
  const [target, setTarget] = useState<Element | undefined>(undefined)

  useEffect(() => {
    waitForElement('[class^="clip_viewer_viewer_area"]')
      .then((x) => {
        const div = document.createElement('div')
        div.id = 'chzzk-pip-clips-download-button'

        const tg = x as HTMLElement
        tg.insertBefore(div, tg.firstChild)

        setTarget(div)
      })
      .catch(console.error)
  }, [])

  return (target !== undefined) ? ReactDOM.createPortal(<ClipsDownloadButton />, target) : null
}
