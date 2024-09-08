import ReactDOM from 'react-dom'

import PIPIcon from '../../static/pip.svg?react'
import { useShortcut } from '../utils/hooks'

export function PIPPortal ({ tg }: { tg: Element | undefined }): React.ReactNode {
  if (tg === undefined) {
    return null
  }

  const div = document.createElement('div')
  div.id = 'chzzk-pip-pip-button'

  tg.insertBefore(div, tg.firstChild)
  return ReactDOM.createPortal(<PIPButton />, div)
}

/**
 * PIPButton component
 *
 * PIP 버튼 컴포넌트입니다.
 */
function PIPButton (): React.ReactNode {
  const clickHandler = (): void => { void makeVideoPIP() }
  useShortcut(['p', 'P', 'ㅔ'], clickHandler)

  return (
    <button
      onClick={clickHandler}
      className='pzp-button pzp-pc-setting-button pzp-pc__setting-button pzp-pc-ui-button'
    >
      <span className='pzp-pc-ui-button__tooltip pzp-pc-ui-button__tooltip--top'>PIP (P)</span>
      <span className='pzp-ui-icon pzp-pc-setting-button__icon'>
        <PIPIcon />
      </span>
    </button>
  )
}

async function makeVideoPIP (): Promise<void> {
  const video = document.querySelector('video')

  if (video === null) {
    return
  }

  try {
    video.disablePictureInPicture = false
    if (document.pictureInPictureElement != null) {
      await document.exitPictureInPicture()
    } else {
      await video.requestPictureInPicture()
    }
  } catch {
    // Metadata 로드 안될 경우 오류 발생하므로 오류 무시
  }
}
