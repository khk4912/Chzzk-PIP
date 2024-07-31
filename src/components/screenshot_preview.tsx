import './screenshot_preview.css'
import DownloadIcon from '../../static/download.svg?react'
import X from '../../static/x.svg?react'

export function ScreenshotPreview (
  { dataURL, title }:
  { dataURL: string, title: string }
): React.ReactNode {
  return (
    <div className='chzzk-pip screenshot-preview-draggable' onMouseDown={mouseDownHandler}>
      <img
        className='screenshot-preview'
        src={dataURL}
        alt='스크린샷 미리보기'

      />
      <div className='screenshot-cover'>
        <a className='download-button' href={dataURL} download={`${title}.png`}>
          <DownloadIcon />
        </a>
        <a className='close-button'>
          <X />
        </a>

      </div>
    </div>
  )
}

function mouseDownHandler (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void {
  const wrappedOverlay = document.querySelector('.screenshot-preview-draggable') as unknown as HTMLElement

  let startPosX = 0
  let startPosY = 0

  const mouseMove = (e: MouseEvent): void => {
    const newPosX = startPosX - e.clientX
    const newPosY = startPosY - e.clientY

    wrappedOverlay.style.left = `${wrappedOverlay.offsetLeft - newPosX}px`
    wrappedOverlay.style.top = `${wrappedOverlay.offsetTop - newPosY}px`

    startPosX = e.clientX
    startPosY = e.clientY
  }

  e.preventDefault()

  startPosX = e.clientX
  startPosY = e.clientY

  document.addEventListener('mousemove', mouseMove)

  document.addEventListener('mouseup', () => {
    document.removeEventListener('mousemove', mouseMove)
  })
}
