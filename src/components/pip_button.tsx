import PIPIcon from '../../static/pip.svg?react'
import { useShortcut } from '../utils/hooks'

export function PIPButton (): React.ReactNode {
  const clickHandler = (): void => { void makeVideoPIP() }
  useShortcut(['p', 'P', 'ㅔ'], clickHandler)

  return (
    <button
      onClick={clickHandler}
      className='pzp-button pzp-pc-setting-button pzp-pc__setting-button pzp-pc-ui-button'
    >
      <span className='pzp-pc-ui-button__tooltip pzp-pc-ui-button__tooltip--top'>PIP (p)</span>
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
