import { useEffect, useState } from 'react'
import PIPIcon from '@/assets/static/pip.svg?react'
import { getKeyBindings } from '@/types/options'
import { renderToString } from 'react-dom/server'
import { createRoot } from 'react-dom/client'

function DocumentPIPInside ({ mediaStream }: { mediaStream: MediaStream }): React.ReactNode {
  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    if (videoRef.current) {
      console.log(mediaStream)
      videoRef.current.srcObject = mediaStream
    }
  }, [mediaStream])

  return (
    <>
      <video ref={videoRef} className='pip+-video' autoPlay playsInline muted />
    </>

  )
}

function DocumentPIP ({ targetElementQuerySelector }: { targetElementQuerySelector: string }): React.ReactNode {
  const [key, setKey] = useState<string>('P')
  const [pipWindow, setPipWindow] = useState<Window | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  const handleClick = async () => {
    if (pipWindow) {
      pipWindow.close()
      setPipWindow(null)
      return
    }
    const targetElement = document.querySelector(targetElementQuerySelector) as HTMLElement

    if (!targetElement) {
      return
    }

    if (!((targetElement instanceof HTMLVideoElement))) {
      return
    }

    videoRef.current = targetElement
    console.log(videoRef.current.srcObject)

    const videoStream = videoRef.current.captureStream?.()

    const newPipWindow = await window.documentPictureInPicture.requestWindow()
    const root = createRoot(newPipWindow.document.body)

    newPipWindow.document.title = 'PIP+'
    root.render(<DocumentPIPInside mediaStream={videoStream} />)

    setPipWindow(newPipWindow)
  }

  useEffect(() => {
    getKeyBindings()
      .then((res) => {
        setKey(res.pip)
      })
      .catch(console.error)
  }, [])

  return (
    <button
      onClick={() => { handleClick().catch(console.error) }}
      className='pzp-button pzp-setting-button pzp-pc-setting-button pzp-pc__setting-button cheese-pip-button'
    >
      <span className='pzp-button__tooltip pzp-button__tooltip--top'>PIP ({key})</span>
      <span className='pzp-ui-icon pzp-pc-setting-button__icon'>
        <PIPIcon />
      </span>
    </button>

  )
}

export default DocumentPIP
