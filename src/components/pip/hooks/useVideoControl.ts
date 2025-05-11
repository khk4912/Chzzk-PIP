import { useState, useEffect } from 'react'

interface UseVideoControlProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  originalVideo: HTMLVideoElement;
}

export function useVideoControl ({ videoRef, originalVideo }: UseVideoControlProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(true)
  const [isMuted, setIsMuted] = useState<boolean>(true)

  // 비디오 상태 초기화
  useEffect(() => {
    setIsPlaying(!originalVideo.paused)
    setIsMuted(originalVideo.muted)
  }, [originalVideo])

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

  return {
    isPlaying,
    isMuted,
    handlePlayPause,
    handleMuteToggle
  }
}
