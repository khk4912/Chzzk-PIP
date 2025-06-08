import ReactDOM from 'react-dom'
import DocumentPIP from './DocumentPIP'

export function PIPPortal (): React.ReactNode {
  const target = usePortal({
    id: 'cheese-pip-pip-button',
    targetSelector: '.custom__clip-button',
    position: 'before'
  })

  return (
    <PIPPortalContainer target={target}>
      <DocumentPIP targetElementQuerySelector='.webplayer-internal-video' />
    </PIPPortalContainer>
  )
}

function PIPPortalContainer ({ target, children }: { target: Element | null, children: React.ReactNode }) {
  return target ? ReactDOM.createPortal(children, target) : null
}

/**
 * PIPButton component
 *
 * PIP 버튼 컴포넌트입니다.
 */
// function PIPButton (): React.ReactNode {
//   const clickHandler = (): void => { makeVideoPIP().catch(console.info) }
//   const [key, setKey] = useState<string>('')

//   return (
//     // <button
//     //   onClick={clickHandler}
//     //   className='pzp-button pzp-setting-button pzp-pc-setting-button pzp-pc__setting-button cheese-pip-button'
//     // >
//     //   <span className='pzp-button__tooltip pzp-button__tooltip--top'>PIP ({key})</span>
//     //   <span className='pzp-ui-icon pzp-pc-setting-button__icon'>
//     //     <PIPIcon />
//     //   </span>
//     // </button>
//     <DocumentPIP targetElementQuerySelector='.live_information_player__uFFcH' buttonText='PIP 창 열기/닫기' />
//   )
// }

// async function makeVideoPIP (): Promise<void> {
//   const video = document.querySelector('video')

//   if (video === null) {
//     return
//   }

//   try {
//     video.disablePictureInPicture = false
//     if (document.pictureInPictureElement != null) {
//       await document.exitPictureInPicture()
//     } else {
//       await video.requestPictureInPicture()
//     }
//   } catch {
//     // Metadata 로드 안될 경우 오류 발생하므로 오류 무시
//   }
// }
