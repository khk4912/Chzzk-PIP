import { useRef } from 'react'

import { useStreamInfo } from './hooks/useStreamInfo'
import { useVideoControl } from './hooks/useVideoControl'
import { useControlVisibility } from './hooks/useControlVisibility'
import { useMediaStream } from './hooks/useMediaStream'

import StreamInfo from './StreamInfo'
import VideoControls from './VideoControls'

interface DocumentPIPInsideProps {
  mediaStream: MediaStream;
  originalVideo: HTMLVideoElement;
  originalDocument: Document;
}

function DocumentPIPInside ({ mediaStream, originalVideo, originalDocument }: DocumentPIPInsideProps): React.ReactNode {
  const videoRef = useRef<HTMLVideoElement | null>(null)

  // 미디어 스트림 관리
  useMediaStream({
    videoRef,
    originalVideo,
    mediaStream
  })

  // 비디오 컨트롤 관리
  const {
    isPlaying,
    isMuted,
    handlePlayPause,
    handleMuteToggle
  } = useVideoControl({
    videoRef,
    originalVideo
  })

  const { isControlVisible, showControls } = useControlVisibility()
  const { streamInfo } = useStreamInfo(originalDocument)

  return (
    <div
      id='pip-main-container'
      onMouseMove={showControls}
      onMouseEnter={showControls}
    >
      <div id='video-cover' />
      <video ref={videoRef} autoPlay playsInline muted />

      {/* 스트리머 정보 */}
      <StreamInfo
        streamInfo={streamInfo}
        isVisible={isControlVisible}
      />

      {/* 비디오 컨트롤 */}
      <VideoControls
        isPlaying={isPlaying}
        isMuted={isMuted}
        isVisible={isControlVisible}
        handlePlayPause={handlePlayPause}
        handleMuteToggle={handleMuteToggle}
      />
    </div>
  )
}

export default DocumentPIPInside
