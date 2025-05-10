import { useEffect, useState, useRef } from 'react'
import { createRoot } from 'react-dom/client'

import { getKeyBindings } from '@/types/options'

import style from './DocumentPIP.css?inline'

import PIPIcon from '@/assets/static/pip.svg?react'
import PlayIcon from '@/assets/static/play.svg?react'
import PauseIcon from '@/assets/static/pause.svg?react'
import VolumeUpIcon from '@/assets/static/volume-up.svg?react'
import VolumeMuteIcon from '@/assets/static/volume-mute.svg?react'
import ViewerIcon from '@/assets/static/viewer.svg?react'

function DocumentPIPInside ({ mediaStream, originalVideo, originalDocument }: { mediaStream: MediaStream, originalVideo: HTMLVideoElement, originalDocument: Document }): React.ReactNode {
  const videoRef = useRef<HTMLVideoElement | null>(null)

  const [isPlaying, setIsPlaying] = useState<boolean>(true)
  const [isMuted, setIsMuted] = useState<boolean>(true)
  const [isControlVisible, setIsControlVisible] = useState<boolean>(false)

  const [streamInfo, setStreamInfo] = useState<{ name: string, title: string, viewerCount: number }>({
    name: 'Streamer',
    title: 'Title',
    viewerCount: 12345
  })

  const controlVisibilityTimeout = useRef<NodeJS.Timeout | null>(null)
  const streamInfoTimeout = useRef<NodeJS.Timeout | null>(null)

  // 버튼 초기화
  useEffect(() => {
    setIsPlaying(!originalVideo.paused)
    setIsMuted(originalVideo.muted)
  }, [originalVideo])

  // PIP Video init
  useEffect(() => {
    if (videoRef.current) {
      console.log(mediaStream)
      videoRef.current.srcObject = mediaStream
    }
  }, [mediaStream])

  // 스트리머 정보 주기적 fetching
  useEffect(() => {
    const getInfo = () => {
      const infos = getStreamInfo(originalDocument)
      const preViewerCount = originalDocument.querySelector('[class^="video_information_count"]')?.textContent ??
                             originalDocument.querySelector('[class^="live_information_player_count"]')?.textContent ?? '0'
      const viewerCount = preViewerCount ? parseInt(preViewerCount.replace(/[^0-9]/g, '')) : 0

      setStreamInfo({
        name: infos.streamerName ?? '스트리머',
        title: infos.streamTitle ?? '제목',
        viewerCount
      })
    }

    getInfo()
    streamInfoTimeout.current = setInterval(() => { getInfo() }, 30000)

    return () => {
      if (streamInfoTimeout.current) {
        clearInterval(streamInfoTimeout.current)
      }
    }
  }, [originalDocument])

  const handlePlayPause = () => {
    if (!videoRef.current) return

    if (isPlaying) {
      videoRef.current.pause()
      originalVideo.pause()
    } else {
      videoRef.current.play().catch(console.error)
      originalVideo.play().catch(console.error)
    }
    setIsPlaying(!isPlaying)
  }

  const handleMuteToggle = () => {
    if (!videoRef.current) return

    videoRef.current.muted = !isMuted
    originalVideo.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const showControls = () => {
    setIsControlVisible(true)

    if (controlVisibilityTimeout.current) {
      clearTimeout(controlVisibilityTimeout.current)
    }

    controlVisibilityTimeout.current = setTimeout(() => {
      setIsControlVisible(false)
    }, 800)
  }

  useEffect(() => {
    showControls()

    return () => {
      if (controlVisibilityTimeout.current) {
        clearTimeout(controlVisibilityTimeout.current)
      }

      if (streamInfoTimeout.current) {
        clearInterval(streamInfoTimeout.current)
      }
    }
  }, [])

  return (
    <div
      id='pip-main-container'
      onMouseMove={showControls}
      onMouseEnter={showControls}
    >
      <div id='video-cover' />
      <video ref={videoRef} autoPlay playsInline muted />

      {/* 스트리머 정보  */}
      <div className={`stream-info-container ${isControlVisible ? 'visible' : ''}`}>
        <div className='streamer-name'>{streamInfo.name}</div>
        <div className='broadcast-title'>{streamInfo.title}</div>
        <div className='viewer-count'>
          <ViewerIcon />
          <span>{streamInfo.viewerCount.toLocaleString()}명</span>
        </div>
      </div>

      {/* 비디오 컨트롤 */}
      <div className={`video-controls-container ${isControlVisible ? 'visible' : ''}`}>
        <div className='left controls'>
          <button className='control-button' onClick={handlePlayPause}>
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>
          <button className='control-button' onClick={handleMuteToggle}>
            {isMuted ? <VolumeMuteIcon /> : <VolumeUpIcon />}
          </button>
        </div>

        {/* <div className='right controls'>
          <button className='control-button' onClick={handlePlayPause}>
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>
          <button className='control-button' onClick={handleMuteToggle}>
            {isMuted ? <VolumeMuteIcon /> : <VolumeUpIcon />}
          </button>
        </div> */}
      </div>
    </div>
  )
}

function DocumentPIP ({ targetElementQuerySelector }: { targetElementQuerySelector: string }): React.ReactNode {
  const [key, setKey] = useState<string>('p')
  const [pipWindow, setPipWindow] = useState<Window | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    return () => {
      if (pipWindow) {
        pipWindow.close()
        setPipWindow(null)
      }
    }
  }, [pipWindow])

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
    const videoStream = videoRef.current.captureStream?.()

    // 오디오 트랙 제거, PIP 창에서 오디오가 나오는 것을 방지 (auto-play 정책 때문)
    // TODO:  documentPIP에서의 volume 컨트롤은 원본 윈도우의 컨트롤과 싱크하게 구현..
    const audioTracks = videoStream?.getAudioTracks()
    if (audioTracks) {
      audioTracks.forEach((track) => {
        videoStream?.removeTrack(track)
      })
    } const docPIPOptions: DocumentPictureInPictureOptions = {
      width: 640,
      height: 360
    }

    const newPipWindow = await window.documentPictureInPicture.requestWindow(docPIPOptions)
    newPipWindow.document.title = 'Cheese-PIP PIP+'

    const css = newPipWindow.document.createElement('style')
    css.innerHTML = style
    newPipWindow.document.head.appendChild(css)

    const pipContainer = newPipWindow.document.createElement('div')
    pipContainer.id = 'pip-plus-container'
    newPipWindow.document.body.appendChild(pipContainer)

    const root = createRoot(pipContainer)
    root.render(<DocumentPIPInside
      mediaStream={videoStream}
      originalVideo={videoRef.current}
      originalDocument={document}
                />)

    newPipWindow.onbeforeunload = () => {
      if (videoRef.current) {
        videoRef.current.srcObject = null
      }
      setPipWindow(null)
    }

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
