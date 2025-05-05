import ReactDOM from 'react-dom'

import './ProgressModal.css'

export function ProgressModalPortal ({ progress }: { progress: number }): React.ReactNode {
  const progressTg = document.getElementById('progress-modal')

  if (progressTg == null) {
    return
  }

  return ReactDOM.createPortal(<ProgressModal progress={progress} />, progressTg)
}

/**
 * ProgressModal component
 *
 * 변환 중일 때 진행률을 표시하는 모달 컴포넌트입니다.
 */
export function ProgressModal ({ progress }: { progress: number }): React.ReactNode {
  return (
    <div className='progress-modal'>
      <div className='progress-modal-content'>
        <span>변환 중...</span>
        <div className='progress-bar'>
          <div className='progress-bar-inner' style={{ width: `${progress}%` }} />
        </div>

        {progress}%
      </div>
    </div>
  )
}
