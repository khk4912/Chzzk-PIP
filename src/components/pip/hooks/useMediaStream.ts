import { type RefObject } from 'react' // Removed useEffect

interface UseMediaStreamProps {
  videoRef: RefObject<HTMLVideoElement>;
  originalVideo: HTMLVideoElement | null;
  mediaStream?: MediaStream;
}

// Helper function to capture stream and remove audio tracks
function captureAndProcessStream (sourceVideo: HTMLVideoElement): MediaStream | undefined {
  const newStream = sourceVideo.captureStream?.()
  if (newStream) {
    const audioTracks = newStream.getAudioTracks()
    audioTracks.forEach((track) => {
      newStream.removeTrack(track)
    })
  }
  return newStream
}

export function useMediaStream ({ videoRef, originalVideo, mediaStream }: UseMediaStreamProps) {
  // PIP Video 초기화
  useEffect(() => {
    if (!videoRef.current || !originalVideo) {
      return
    }

    if (mediaStream) {
      // If a specific mediaStream is provided, use it.
      videoRef.current.srcObject = mediaStream
    } else {
      // Otherwise, capture from the original video.
      const processedStream = captureAndProcessStream(originalVideo)
      if (processedStream) {
        videoRef.current.srcObject = processedStream
      }
    }
  }, [videoRef, mediaStream, originalVideo])

  // 원본 비디오 소스 변경 감지
  useEffect(() => {
    if (!originalVideo || !videoRef.current) {
      return
    }

    const handleSourceChange = () => {
      if (videoRef.current && originalVideo) { // Ensure refs are still current
        const processedStream = captureAndProcessStream(originalVideo)
        if (processedStream) {
          videoRef.current.srcObject = processedStream
        }
      }
    }

    // Initial sync in case the source is already set or changed before observer attaches
    handleSourceChange()

    const observer = new MutationObserver(handleSourceChange)
    observer.observe(originalVideo, { attributes: true, attributeOldValue: true, attributeFilter: ['src'] })

    return () => {
      observer.disconnect()
    }
  }, [originalVideo, videoRef])
}
