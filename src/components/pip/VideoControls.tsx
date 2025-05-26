import PlayIcon from '@/assets/static/play.svg?react'
import PauseIcon from '@/assets/static/pause.svg?react'
import RecIcon from '@/assets/static/rec.svg?react'
import VolumeUpIcon from '@/assets/static/volume-up.svg?react'
import VolumeMuteIcon from '@/assets/static/volume-mute.svg?react'
import ScreenshotIcon from '@/assets/static/screenshot.svg?react'
import { useScreenshot } from '@/hooks/useScreenshot' // Import the new hook

interface VideoControlsProps {
  isPlaying: boolean
  isMuted: boolean
  isVisible: boolean
  handlePlayPause: () => void
  handleMuteToggle: () => void
}

function VideoControls ({
  isPlaying,
  isMuted,
  isVisible,
  handlePlayPause,
  handleMuteToggle,
}: VideoControlsProps): React.ReactNode {
  const { options } = useOptions()
  const { clickHandler, isRecording } = useRecord()
  const { takeScreenshot } = useScreenshot() // Use the new hook

  const handleScreenshotClick = () => {
    const videoElement = document.querySelector('.webplayer-internal-video') as HTMLVideoElement
    if (videoElement) {
      takeScreenshot(videoElement).catch(console.error)
    } else {
      console.warn('Video element for screenshot not found.')
    }
  }

  return (
    <div className={`video-controls-container ${isVisible ? 'visible' : ''}`}>
      <div className='left controls'>
        <button className='control-button' onClick={handlePlayPause}>
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>
        <button className='control-button' onClick={handleMuteToggle}>
          {isMuted ? <VolumeMuteIcon /> : <VolumeUpIcon />}
        </button>
      </div>

      <div className='right controls'>
        {options.rec && (
          <button className='control-button' onClick={() => { clickHandler().catch(console.error) }}>
            <RecIcon style={{ fill: isRecording ? 'red' : 'white' }} />
          </button>
        )}
        {options.screenshot && (
          <button className='control-button' onClick={handleScreenshotClick}>
            <ScreenshotIcon />
          </button>
        )}
      </div>
    </div>
  )
}

// Removed the old ScreenshotButton inner component as its logic is now in useScreenshot hook.

export default VideoControls
