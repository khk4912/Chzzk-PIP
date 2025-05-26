import './rec_overlay.css'
import ReactDOM from 'react-dom'
import { useStopwatch } from '@/hooks/useStopwatch' // Import the new hook

const secondsToTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, '0')
  const remainSeconds = (seconds % 60).toString().padStart(2, '0')

  return `${minutes}:${remainSeconds}`
}

/**
 * RecordOverlay component
 *
 * 녹화 중 녹화 시간을 화면에 표시하는 컴포넌트입니다.
 * It uses the useStopwatch hook to manage the recording timer.
 */
function RecordOverlay (): React.ReactNode {
  // useStopwatch hook manages the seconds state and the interval timer.
  const seconds = useStopwatch()

  return (
    <>
      <div id='red-dot' />
      {/* Display the elapsed time, formatted by secondsToTime utility */}
      <span id='timeText'>{secondsToTime(seconds)}</span>
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
  }, [])

  if (target === null) {
    return null
  }

  return ReactDOM.createPortal(<RecordOverlay />, overlay)
}
