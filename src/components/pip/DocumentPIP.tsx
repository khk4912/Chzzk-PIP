import { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'

import { getKeyBindings } from '@/types/options'
import { usePIPWindow } from './hooks/usePIPWindow'

import style from './DocumentPIP.css?inline'
import PIPIcon from '@/assets/static/pip.svg?react'
import DocumentPIPInside from './DocumentPIPInside'

function DocumentPIP ({ targetElementQuerySelector }: { targetElementQuerySelector: string }): React.ReactNode {
  const [key, setKey] = useState<string>('p')
  const { pipWindow, setPipWindow, videoRef } = usePIPWindow()

  const handleClick = async () => {
    if (pipWindow) {
      pipWindow.close()
      setPipWindow(null)
      return
    }

    const targetElement = document.querySelector(targetElementQuerySelector) as HTMLElement
    if (!targetElement || !(targetElement instanceof HTMLVideoElement)) {
      return
    }

    videoRef.current = targetElement
    const videoStream = videoRef.current.captureStream?.()
    if (!videoStream) {
      return
    }

    removeAudioTracks(videoStream)

    const docPIPOptions = createPIPOptions(videoRef.current)
    const newPipWindow = await createPIPWindow(docPIPOptions, videoStream)

    setPipWindow(newPipWindow)
  }

  // 오디오 트랙 제거, PIP 창에서 오디오가 나오는 것을 방지 (auto-play 정책 때문)
  const removeAudioTracks = (stream: MediaStream) => {
    const audioTracks = stream.getAudioTracks()
    if (audioTracks) {
      audioTracks.forEach(track => stream.removeTrack(track))
    }
  }

  const createPIPOptions = (video: HTMLVideoElement): DocumentPictureInPictureOptions => {
    return {
      width: video?.clientWidth / 2 || 640,
      height: video?.clientHeight / 2 || 360
    }
  }

  const createPIPWindow = async (options: DocumentPictureInPictureOptions, videoStream: MediaStream): Promise<Window> => {
    const newPipWindow = await window.documentPictureInPicture.requestWindow(options)
    newPipWindow.document.title = 'Cheese-PIP PIP+'

    // 스타일 추가
    const css = newPipWindow.document.createElement('style')
    css.innerHTML = style
    newPipWindow.document.head.appendChild(css)

    const pipContainer = newPipWindow.document.createElement('div')
    pipContainer.id = 'pip-plus-container'
    newPipWindow.document.body.appendChild(pipContainer)

    const root = createRoot(pipContainer)
    root.render(
      <DocumentPIPInside
        mediaStream={videoStream}
        originalVideo={videoRef.current!}
        originalDocument={document}
      />
    )

    newPipWindow.onbeforeunload = () => {
      if (videoRef.current) {
        videoRef.current.srcObject = null
      }
      setPipWindow(null)
    }

    return newPipWindow
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
      className='pzp-button pzp-setting-button pzp-pc-setting-button pzp-pc__setting-button cheese-pip-plus-button'
    >
      <span className='pzp-button__tooltip pzp-button__tooltip--top'>PIP ({key})</span>
      <span className='pzp-ui-icon pzp-pc-setting-button__icon'>
        <PIPIcon />
      </span>
    </button>

  )
}

export default DocumentPIP
