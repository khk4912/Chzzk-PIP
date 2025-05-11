import ViewerIcon from '@/assets/static/viewer.svg?react'
import { StreamInfoData } from './hooks/useStreamInfo'

interface StreamInfoProps {
  streamInfo: StreamInfoData;
  isVisible: boolean;
}

function StreamInfo ({ streamInfo, isVisible }: StreamInfoProps): React.ReactNode {
  return (
    <div className={`stream-info-container ${isVisible ? 'visible' : ''}`}>
      <div className='streamer-name'>{streamInfo.name}</div>
      <div className='broadcast-title'>{streamInfo.title}</div>
      <div className='viewer-count'>
        <ViewerIcon />
        <span>{streamInfo.viewerCount.toLocaleString()}명</span>
      </div>
    </div>
  )
}

export default StreamInfo
