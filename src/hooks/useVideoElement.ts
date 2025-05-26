import { useEffect, useRef } from 'react'

/**
 * Custom hook to get a reference to a video element based on a CSS selector.
 *
 * @param selector - The CSS selector to find the video element.
 * @returns A React ref object pointing to the HTMLVideoElement, or null if not found or not a video element.
 */
export function useVideoElement (selector: string): React.RefObject<HTMLVideoElement | null> {
  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    const element = document.querySelector(selector)
    if (element instanceof HTMLVideoElement) {
      videoRef.current = element
    } else {
      videoRef.current = null
      if (element) {
        console.warn(`Element found with selector "${selector}" is not an HTMLVideoElement.`)
      } else {
        console.warn(`No element found with selector "${selector}".`)
      }
    }
  }, [selector])

  return videoRef
}
