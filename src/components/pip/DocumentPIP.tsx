import { useEffect, useState, useRef, useCallback } from 'react'
import ReactDOM from 'react-dom'

import { getKeyBindings } from '@/types/options'
import { useShortcut } from '@/utils/hooks'

import PIPIcon from '@/assets/static/pip.svg?react'
import DocumentPIPInside from './DocumentPIPInside'

import { usePictureInPicture } from './hooks/usePictureInPicture'

function useVideoElement (selector: string) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const video = useElementTarget(selector) as HTMLVideoElement | null

  useEffect(() => {
    videoRef.current = video
  }, [video])

  return videoRef
}

function DocumentPIP ({ targetElementQuerySelector }: { targetElementQuerySelector: string }): JSX.Element {
  const [key, setKey] = useState<string>('p')
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
    waitForElement('.pzp-button.pzp-pip-button')
      .then((button) => {
        if (button !== null) {
          button.remove()
        }
      })
      .catch(console.log)
  }, [])

  useEffect(() => {
    getKeyBindings()
      .then((res) => {
        setKey(res.pip)
      })
      .catch(console.error)
  }, [])

  useEffect(() => {
    return () => {
      if (pipWindow) {
        pipWindow.close()
      }
    }
  })

  useShortcut(key, () => { handleClick().catch(console.error) })

  return (
    <>
      <button
        onClick={() => { handleClick().catch(console.error) }}
        className='pzp-button pzp-setting-button pzp-pc-setting-button pzp-pc__setting-button cheese-pip-plus-button'
      >
        <span className='pzp-button__tooltip pzp-button__tooltip--top'>PIP+ ({key})</span>
        <span className='pzp-ui-icon pzp-pc-setting-button__icon'>
          <PIPIcon />
        </span>
      </button>

      <PIPContainer pipWindow={pipWindow}>
        {videoRef.current && <DocumentPIPInside
          originalVideo={videoRef.current}
          originalDocument={document}
          stream={processedStream}
                             />}
      </PIPContainer>
    </>
  )
}

// React Portal을 사용하여 PIP 창에 컴포넌트 렌더링
function PIPContainer ({ pipWindow, children }: { pipWindow: Window | null, children: React.ReactNode }) {
  return pipWindow ? ReactDOM.createPortal(children, pipWindow.document.body) : null
}

export default DocumentPIP
