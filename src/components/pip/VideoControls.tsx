import PlayIcon from '@/assets/static/play.svg?react'
import PauseIcon from '@/assets/static/pause.svg?react'
import RecIcon from '@/assets/static/rec.svg?react'
import VolumeUpIcon from '@/assets/static/volume-up.svg?react'
import VolumeMuteIcon from '@/assets/static/volume-mute.svg?react'

interface VideoControlsProps {
  isPlaying: boolean;
  isMuted: boolean;
  isVisible: boolean;
  handlePlayPause: () => void;
  handleMuteToggle: () => void;
}

function VideoControls ({
  isPlaying,
  isMuted,
  isVisible,
  handlePlayPause,
  handleMuteToggle,
}: VideoControlsProps): React.ReactNode {
  const { options } = useOptions()

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
          <button className='control-button' onClick={() => {}}>
            <RecIcon />
          </button>}
      </div>
    </div>
  )
}

export default VideoControls
