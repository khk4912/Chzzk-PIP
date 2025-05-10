import { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'

import { getKeyBindings } from '@/types/options'

import PIPIcon from '@/assets/static/pip.svg?react'

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
      <video ref={videoRef} className='pip-plus-video' autoPlay playsInline muted />
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

    // 오디오 트랙 제거, PIP 창에서 오디오가 나오는 것을 방지
    // TODO:  documentPIP에서의 volume 컨트롤은 원본 윈도우의 컨트롤과 싱크하게 구현..
    const audioTracks = videoStream?.getAudioTracks()
    if (audioTracks) {
      audioTracks.forEach((track) => {
        videoStream?.removeTrack(track)
      })
    }

    const newPipWindow = await window.documentPictureInPicture.requestWindow()

    const pipContainer = document.createElement('div')
    pipContainer.id = 'pip-plus-container'

    newPipWindow.document.body.appendChild(pipContainer)
    const root = createRoot(pipContainer)

    newPipWindow.document.title = 'Cheese-PIP PIP+'
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
