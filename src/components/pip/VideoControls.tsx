import PlayIcon from '@/assets/static/play.svg?react'
import PauseIcon from '@/assets/static/pause.svg?react'
import RecIcon from '@/assets/static/rec.svg?react'
import VolumeUpIcon from '@/assets/static/volume-up.svg?react'
import VolumeMuteIcon from '@/assets/static/volume-mute.svg?react'
import ScreenshotIcon from '@/assets/static/screenshot.svg?react'

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
        {options.rec &&
          <button className='control-button' onClick={() => { clickHandler().catch(console.error) }}>
            <RecIcon style={{ fill: isRecording ? 'red' : 'white' }} />
          </button>}
        {options.screenshot && <ScreenshotButton />}
      </div>
    </div>
  )
}

const ScreenshotButton = () => {
  const screenshotHandler = () => {
    const video = document.querySelector('.webplayer-internal-video')
    if (!(video instanceof HTMLVideoElement)) {
      return
    }

    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    const ctx = canvas.getContext('2d')
    if (ctx === null) {
      return
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    const info = getStreamInfo(document)

    const yyyymmddhhmmss = (date: Date): string => {
      const yyyy = date.getFullYear()
      const mm = String(date.getMonth() + 1).padStart(2, '0')
      const dd = String(date.getDate()).padStart(2, '0')
      const hh = String(date.getHours()).padStart(2, '0')
      const mi = String(date.getMinutes()).padStart(2, '0')
      const ss = String(date.getSeconds()).padStart(2, '0')

      return `${yyyy}${mm}${dd}${hh}${mi}${ss}`
    }

    const title = `${info.streamerName}_${info.streamTitle}_${yyyymmddhhmmss(new Date())}`
    download(canvas.toDataURL('image/png'), sanitizeFileName(title), 'png').catch(console.error)
  }

  return (
    <button className='control-button' onClick={() => { screenshotHandler() }}>
      <ScreenshotIcon />
    </button>
  )
}

export default VideoControls
