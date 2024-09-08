import { useState } from 'react'
import ReactDOM from 'react-dom'

import { isVODPage, isClipPage } from '../utils/download/download'
import DownloadIcon from '../../static/download.svg?react'
import { DownloadVODModalPortal } from './download_modal'
import { downloadClip } from '../utils/download/clip'

export function DownloadPortal ({ tg }: { tg: Element | undefined }): React.ReactNode {
  if (tg === undefined) {
    return null
  }

  const div = document.createElement('div')
  div.id = 'chzzk-pip-download-button'

  tg.insertBefore(div, tg.firstChild)
  return ReactDOM.createPortal(<DownloadButton />, div)
}

/**
 * DownloadButton component
 *
 * VOD나 embed된 클립에 삽입되는 다운로드 버튼 컴포넌트입니다.
 */
function DownloadButton (): React.ReactNode {
  const [downloadModalState, setDownloadModalState] = useState(false)

  return (
    <>
      {downloadModalState && <DownloadVODModalPortal setState={setDownloadModalState} />}
      <button
        onClick={() => {
          if (isVODPage()) {
            // VOD 페이지에서 다운로드 버튼 클릭 시, 다운로드 모달
            setDownloadModalState(true)
          } else if (isClipPage()) {
            // 클립 embed 페이지에서 다운로드 버튼 클릭 시, 클립 다운로드
            downloadClip().catch(console.error)
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
