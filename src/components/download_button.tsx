import { useState } from 'react'
import ReactDOM from 'react-dom'

import { isVODPage, isClipPage } from '../utils/download/download'
import DownloadIcon from '../../static/download.svg?react'
import { DownloadVODModalPortal } from './download_modal'

export function DownloadPortal ({ tg }: { tg: Element | undefined }): React.ReactNode {
  if (tg === undefined) {
    return null
  }

  const div = document.createElement('div')
  div.id = 'chzzk-pip-download-button'

  tg.insertBefore(div, tg.firstChild)
  return ReactDOM.createPortal(<DownloadButton />, div)
}

function DownloadButton (): React.ReactNode {
  const [downloadModalState, setDownloadModalState] = useState(false)

  return (
    <>
      {downloadModalState && <DownloadVODModalPortal setState={setDownloadModalState} />}
      <button
        onClick={() => {
          if (isVODPage()) {
            setDownloadModalState(true)
          } else if (isClipPage()) {
            // Download Clip
          }
        }}
        className='pzp-button pzp-pc-setting-button pzp-pc__setting-button pzp-pc-ui-button'
      >
        <span className='pzp-pc-ui-button__tooltip pzp-pc-ui-button__tooltip--top'>다운로드</span>
        <span className='pzp-ui-icon pzp-pc-setting-button__icon'>
          <DownloadIcon />
        </span>
      </button>
    </>
  )
}
