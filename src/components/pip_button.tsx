import PIPIcon from '../../static/pip.svg?react'

export function PIPButton (): React.ReactNode {
  return (
    <button
      onClick={() => { void makeVideoPIP() }}
      className='pzp-button pzp-pc-setting-button pzp-pc__setting-button pzp-pc-ui-button'
    >
      <span className='pzp-pc-ui-button__tooltip pzp-pc-ui-button__tooltip--top'>PIP</span>
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

  video.disablePictureInPicture = false
  if (document.pictureInPictureElement != null) {
    await document.exitPictureInPicture()
  } else {
    await video.requestPictureInPicture()
  }
}
