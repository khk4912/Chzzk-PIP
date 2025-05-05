import './rec_overlay.css'
import ReactDOM from 'react-dom'
import { useEffect, useRef, useState } from 'react'

const secondsToTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, '0')
  const remainSeconds = (seconds % 60).toString().padStart(2, '0')

  return `${minutes}:${remainSeconds}`
}

/**
 * RecordOverlay component
 *
 * 녹화 중 녹화 시간을 화면에 표시하는 컴포넌트입니다.
 */
function RecordOverlay (): React.ReactNode {
  const [sec, setSec] = useState(0)
  const timer = useRef<number>()

  useEffect(() => {
    timer.current = window.setInterval(() => {
      setSec((prev) => prev + 1)
    }, 1000)

    return () => {
      window.clearInterval(timer.current)
    }
  }, [])

  return (
    <>
      <div id='red-dot' />
      <span id='timeText'>{secondsToTime(sec)}</span>
    </>
  )
}

export function RecordOverlayPortal (): React.ReactNode {
  // const target = document.querySelector('[class^=live_information_player_area]')
  const target = document.querySelector('.header_info')

  const overlay = document.createElement('div')
  overlay.id = 'timer-wrapper'
  target?.insertBefore(overlay, target.firstChild)

  useEffect(() => {
    return () => {
      overlay.remove()
    }
  })

  if (target === null) {
    return null
  }

  return ReactDOM.createPortal(<RecordOverlay />, overlay)
}
