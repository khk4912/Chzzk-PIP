import ReactDOM from 'react-dom'

export function PIPPortal ({ tg }: { tg: Element | undefined }): React.ReactNode {
  if (tg === undefined) {
    return null
  }

  const div = document.createElement('div')
  div.id = 'cheese-pip-pip-button'

  tg.insertBefore(div, tg.firstChild)
  return ReactDOM.createPortal(<DocumentPIP targetElementQuerySelector='video' />, div)
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
