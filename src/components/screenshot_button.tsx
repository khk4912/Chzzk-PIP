import ScreenshotIcon from '../../static/screenshot.svg?react'

export function ScreenshotButton (): React.ReactNode {
  return (
    <button className='pzp-button pzp-pc-setting-button pzp-pc__setting-button pzp-pc-ui-button chzzk-screenshot-button'>
      <span className='pzp-pc-ui-button__tooltip pzp-pc-ui-button__tooltip--top'>스크린샷 (s)</span>
      <span className='pzp-ui-icon pzp-pc-setting-button__icon'>
        <ScreenshotIcon />
      </span>
    </button>
  )
}
