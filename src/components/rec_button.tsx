import RecIcon from '../../static/rec.svg?react'

export function RecordButton (): React.ReactNode {
  return (
    <button className='pzp-button pzp-pc-setting-button pzp-pc__setting-button pzp-pc-ui-button chzzk-record-button'>
      <span className='pzp-pc-ui-button__tooltip pzp-pc-ui-button__tooltip--top'>녹화 (r)</span>
      <span className='pzp-ui-icon pzp-pc-setting-button__icon'>
        <RecIcon />
      </span>
    </button>
  )
}
