import { useEffect, RefObject } from 'react'

interface UseMediaStreamProps {
  videoRef: RefObject<HTMLVideoElement>;
  originalVideo: HTMLVideoElement;
  mediaStream?: MediaStream;
}

export function useMediaStream ({ videoRef, originalVideo, mediaStream }: UseMediaStreamProps) {
  // PIP Video 초기화
  useEffect(() => {
    if (videoRef.current && mediaStream) {
      videoRef.current.srcObject = mediaStream
    }
  }, [videoRef, mediaStream])

  // 원본 비디오 소스 변경 감지
  useEffect(() => {
    const handleSourceChange = () => {
      if (videoRef.current) {
        const newStream = originalVideo.captureStream?.()

        if (newStream) {
          const audioTracks = newStream.getAudioTracks()
          if (audioTracks) {
            audioTracks.forEach((track) => {
              newStream.removeTrack(track)
            })
          }

          videoRef.current.srcObject = newStream
        }
      }
    }

    handleSourceChange()

    const observer = new MutationObserver(handleSourceChange)
    observer.observe(originalVideo, { attributes: true, attributeOldValue: true, attributeFilter: ['src'] })

    return () => {
      observer.disconnect()
    }
  }, [originalVideo, videoRef])
}
