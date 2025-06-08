import DocumentPIPStyle from '../DocumentPIP.css?inline'

export function usePictureInPicture (videoRef: React.RefObject<HTMLVideoElement>) {
  const [pipWindow, setPipWindow] = useState<Window | null>(window.documentPictureInPicture.window)

  const removeAudioTracks = useCallback((stream: MediaStream) => {
    const audioTracks = stream.getAudioTracks()
    if (audioTracks.length > 0) {
      audioTracks.forEach(track => stream.removeTrack(track))
    }
    return stream
  }, [])

  const createPIPOptions = useCallback((video: HTMLVideoElement): DocumentPictureInPictureOptions => {
    return {
      width: video.clientWidth / 2 || 640,
      height: video.clientHeight / 2 || 360
    }
  }, [])

  const togglePictureInPicture = useCallback(async () => {
    try {
      // 이미 PIP 창이 열려있으면 닫기
      if (pipWindow) {
        pipWindow.close()
        setPipWindow(null)
        return
      }

      // 비디오 요소가 없으면 중단
      if (!videoRef.current) {
        return
      }

      // PIP 창 생성
      const options = createPIPOptions(videoRef.current)
      const newWindow = await window.documentPictureInPicture.requestWindow(options)

      // PIP 창에 스타일 적용
      const style = newWindow.document.createElement('style')
      style.innerHTML = DocumentPIPStyle
      newWindow.document.head.appendChild(style)

      // 창 제목 설정
      newWindow.document.title = 'Cheese-PIP PIP+'

      setPipWindow(newWindow)
    } catch (error) {
      console.error('PIP 창 생성 중 오류가 발생했습니다:', error)
    }
  }, [pipWindow, videoRef, createPIPOptions])

  // PIP 창 닫힘 감지
  useEffect(() => {
    const handleWindowClose = (): void => {
      setPipWindow(null)
    }

    pipWindow?.addEventListener('pagehide', handleWindowClose)

    return () => {
      pipWindow?.removeEventListener('pagehide', handleWindowClose)
    }
  }, [pipWindow])

  return {
    pipWindow,
    togglePictureInPicture,
    removeAudioTracks
  }
}
