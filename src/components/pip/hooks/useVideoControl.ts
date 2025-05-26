// Removed useState, useEffect from imports
// Added useCallback for memoizing handlers

interface UseVideoControlProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  originalVideo: HTMLVideoElement | null;
}

export function useVideoControl ({ videoRef, originalVideo }: UseVideoControlProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(true)
  const [isMuted, setIsMuted] = useState<boolean>(true)

  // 비디오 상태 초기화
  useEffect(() => {
    if (originalVideo) {
      setIsPlaying(!originalVideo.paused)
      setIsMuted(originalVideo.muted)
    }
  }, [originalVideo])

  const handlePlayPause = useCallback(() => {
    if (!videoRef.current || !originalVideo) return

    if (isPlaying) {
      videoRef.current.pause()
      originalVideo.pause()
    } else {
      videoRef.current.play().catch(console.error)
      originalVideo.play().catch(console.error)
    }
    setIsPlaying(prevIsPlaying => !prevIsPlaying)
  }, [videoRef, originalVideo, isPlaying])

  const handleMuteToggle = useCallback(() => {
    if (!videoRef.current || !originalVideo) return

    videoRef.current.muted = !isMuted
    originalVideo.muted = !isMuted
    setIsMuted(prevIsMuted => !prevIsMuted)
  }, [videoRef, originalVideo, isMuted])

  return {
    isPlaying,
    isMuted,
    handlePlayPause,
    handleMuteToggle
  }
}
