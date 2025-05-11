import { useState, useEffect, useRef } from 'react'

export function useControlVisibility () {
  const [isControlVisible, setIsControlVisible] = useState<boolean>(false)
  const controlVisibilityTimeout = useRef<NodeJS.Timeout | null>(null)

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
    }
  }, [])

  return {
    isControlVisible,
    showControls
  }
}
