import ReactDOM from 'react-dom'
import style from './draggable_preview.module.css'

import DownloadIcon from '../../static/download.svg?react'
import XIcon from '../../static/x.svg?react'
import { useEffect, useRef, useState } from 'react'
import { download } from '../utils/download/clip'

interface PreviewProp { imageURL: string, fileName: string, idx: number, setShow?: React.Dispatch<React.SetStateAction<boolean>>, setPortal?: React.Dispatch<React.SetStateAction<React.ReactNode[]>> }
function PreviewButton ({ children, onClick }: { children: React.ReactNode, onClick?: () => void }): React.ReactNode {
  return (
    <button
      className={style.previewButton}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

function DraggablePreview ({ imageURL, fileName, setShow }: PreviewProp): React.ReactNode {
  const self = useRef<HTMLDivElement>(null)

  let startPosX = 0
  let startPosY = 0

  const handleMouseDown = (e: MouseEvent): void => {
    const mouseMove = (e: MouseEvent): void => {
      const div = self.current
      if (div === null) {
        return
      }

      const newX = startPosX - e.clientX
      const newY = startPosY - e.clientY

      div.style.left = `${div.offsetLeft - newX}px`
      div.style.top = `${div.offsetTop - newY}px`

      startPosX = e.clientX
      startPosY = e.clientY
    }

    startPosX = e.clientX
    startPosY = e.clientY

    e.preventDefault()

    document.addEventListener('mousemove', mouseMove)
    document.addEventListener('mouseup', () => {
      document.removeEventListener('mousemove', mouseMove)
    })
  }

  return (
    <div
      ref={self}
      className={style.chzzkScreenshotOverlay}
      onMouseDown={(e) => { handleMouseDown(e.nativeEvent) }}

    >
      <img className={style.screenshot} src={imageURL} alt={fileName} />
      <div className={style.chzzkScreenshotCover}>
        <PreviewButton
          onClick={() => {
            if (setShow === undefined) {
              return
            }
            setShow(false)
          }}

        ><XIcon />
        </PreviewButton>
        <PreviewButton
          onClick={() => {
            void download(imageURL, fileName, 'png')

            if (setShow === undefined) {
              return
            }
            setShow(false)
          }}
        ><DownloadIcon />
        </PreviewButton>
      </div>
    </div>
  )
}

export function DraggablePreviewPortal ({ imageURL, fileName, idx, setPortal }: PreviewProp): React.ReactNode {
  const [show, setShow] = useState(true)

  const div = document.createElement('div')
  div.id = 'chzzk-pip-screenshot-preview'

  useEffect(() => {
    if (!show) {
      div.remove()
    }

    return () => {
      if (setPortal !== undefined) {
        setPortal((prev) => prev.filter((_, i) => i !== idx))
      }

      div.remove()
    }
  }, [div, show, idx, setPortal])

  const target = document.querySelector('[class^="toolbar_container"]') ??
  document.querySelector('[class^="layout_glive"]')

  if (target === null) {
    return null
  }

  target.parentNode?.insertBefore(div, target)

  return show && ReactDOM.createPortal(
    <DraggablePreview
      imageURL={imageURL}
      fileName={fileName}
      setShow={setShow}
      idx={idx}
    />,
    div
  )
}
