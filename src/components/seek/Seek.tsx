import ReactDOM from 'react-dom'
// Removed React specific imports like useEffect, useRef, useState as they are now encapsulated in useFlash or not needed.
// Unimport will handle useState, useEffect for SeekPortal if still used there.

import './seek.css'
import { useFlash } from '@/hooks/useFlash' // Import the new hook
import LeftSVG from '@/assets/static/seek_left.svg?react'
import RightSVG from '@/assets/static/seek_right.svg?react'

import { waitForElement } from '@/entrypoints/content/inject_btn'

function SeekLeft ({ state }: { state: boolean }): React.ReactNode {
  return (
    <div className='chzzk-seek-overlay seek-left' style={{ opacity: Number(state) }}>
      <LeftSVG />
      <span>- 5초</span>
    </div>
  )
}

function SeekRight ({ state }: { state: boolean }): React.ReactNode {
  return (
    <div className='chzzk-seek-overlay seek-right' style={{ opacity: Number(state) }}>
      <RightSVG />
      <span>+ 5초</span>
    </div>
  )
}

export function SeekPortal (): React.ReactNode {
  const [target, setTarget] = useState<Element | null>(null)

  useEffect(() => {
    waitForElement('.pzp-command-icon')
      .then(
        (element) => {
          const div = document.createElement('div')
          div.id = 'chzzk-seek-portal'

          element.insertAdjacentElement('afterend', div)
          setTarget(div)
        }).catch(console.error)
  }, [])

  return target === null ? target : ReactDOM.createPortal(<Seek />, target)
}

/**
 * Seek component
 *
 * 스트림을 앞뒤로 탐색하고,
 * 스트림 화면에 탐색 중임을 표시해주는 컴포넌트입니다.
 * It uses the useFlash hook to manage the visibility of seek indicators.
 */
function Seek (): React.ReactNode {
  // Use the useFlash hook for left and right seek indicators.
  // Duration is 1000ms (1 second).
  const [isLeftVisible, triggerLeftFlash] = useFlash(1000)
  const [isRightVisible, triggerRightFlash] = useFlash(1000)

  // The useEffect for clearing timers is no longer needed here,
  // as useFlash handles its own timer cleanup internally.

  useShortcut('ArrowLeft', () => {
    const video = document.querySelector('.webplayer-internal-video')
    if (video instanceof HTMLVideoElement) {
      seekLeft(video) // Assumes seekLeft is available globally or via import
    }
    triggerLeftFlash() // Trigger the flash for the left indicator
  })

  useShortcut('ArrowRight', () => {
    const video = document.querySelector('.webplayer-internal-video')
    if (video instanceof HTMLVideoElement) {
      seekRight(video) // Assumes seekRight is available globally or via import
    }
    triggerRightFlash() // Trigger the flash for the right indicator
  })

  return (
    <>
      <SeekLeft state={isLeftVisible} />
      <SeekRight state={isRightVisible} />
    </>
  )
}
