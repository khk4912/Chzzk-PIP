import { useState, useEffect, useRef } from 'react'

export function usePIPWindow () {
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

  const closePIPWindow = () => {
    if (pipWindow) {
      pipWindow.close()
      setPipWindow(null)
    }
  }

  return {
    pipWindow,
    setPipWindow,
    videoRef,
    closePIPWindow
  }
}
