import { useRef, useCallback } from 'react' // Removed useEffect, useState
import ReactDOM from 'react-dom'

// Removed getKeyBindings as it's now used by useKeyBinding hook
import { useShortcut } from '@/utils/hooks'
import { useVideoElement } from '@/hooks/useVideoElement'
import { useKeyBinding } from '@/hooks/useKeyBinding' // Import the new hook

import PIPIcon from '@/assets/static/pip.svg?react'
import DocumentPIPInside from './DocumentPIPInside'

import { usePictureInPicture } from './hooks/usePictureInPicture'

function DocumentPIP ({ targetElementQuerySelector }: { targetElementQuerySelector: string }): JSX.Element {
  // Use the useKeyBinding hook to get the PIP shortcut key
  const { key: pipKey, isLoading: isPipKeyLoading } = useKeyBinding('pip')
  const videoRef = useVideoElement(targetElementQuerySelector)
  const { pipWindow, togglePictureInPicture, removeAudioTracks } = usePictureInPicture(videoRef)

  // 스트림 생성 및 오디오 트랙 제거
  const stream = videoRef.current?.captureStream?.()
  const processedStream = stream ? removeAudioTracks(stream) : undefined

  // PIP 버튼 클릭 핸들러
  const handleClick = useCallback(async () => {
    await togglePictureInPicture()
  }, [togglePictureInPicture])

  useEffect(() => {
    // Removes the default Naver Player PIP button to prevent conflicts or UI clutter.
    // This extension provides its own PIP button and functionality.
    const button = document.querySelector('.pzp-button.pzp-pip-button')
    if (button !== null) {
      button.remove()
    }
  }, [])

  // The useEffect for fetching getKeyBindings is removed, now handled by useKeyBinding.

  // useShortcut will automatically update if pipKey changes.
  useShortcut(pipKey, () => { handleClick().catch(console.error) })

  return (
    <>
      <button
        onClick={() => { handleClick().catch(console.error) }}
        className='pzp-button pzp-setting-button pzp-pc-setting-button pzp-pc__setting-button cheese-pip-plus-button'
      >
        {/* Display the pipKey. If isPipKeyLoading, it will show the default then update.
            A loading indicator could be added:
            <span className='pzp-button__tooltip pzp-button__tooltip--top'>PIP+ ({isPipKeyLoading ? '...' : pipKey})</span>
        */}
        <span className='pzp-button__tooltip pzp-button__tooltip--top'>PIP+ ({pipKey})</span>
        <span className='pzp-ui-icon pzp-pc-setting-button__icon'>
          <PIPIcon />
        </span>
      </button>

      <PIPContainer pipWindow={pipWindow}>
        <DocumentPIPInside
          originalVideo={videoRef.current}
          originalDocument={document}
          stream={processedStream}
        />
      </PIPContainer>
    </>
  )
}

// React Portal을 사용하여 PIP 창에 컴포넌트 렌더링
function PIPContainer ({ pipWindow, children }: { pipWindow: Window | null, children: React.ReactNode }) {
  return pipWindow ? ReactDOM.createPortal(children, pipWindow.document.body) : null
}

export default DocumentPIP
