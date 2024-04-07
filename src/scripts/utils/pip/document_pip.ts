import { waitForElement } from '../inject/inject_btns'

export interface WindowWithDocumentPictureInPicture extends Window {
  documentPictureInPicture?: {
    requestWindow?: (options: { width: number, height: number }) => Promise<Window>
  }
}

export async function windowPIP (): Promise<void> {
  const wrapper = await waitForElement('.webplayer-internal-source-wrapper').catch(() => null)
  const video = await waitForElement('.webplayer-internal-video').catch(() => null)

  if (wrapper === null || video === null) {
    return
  }

  const styleSheets = Array.from(document.styleSheets)

  const w: WindowWithDocumentPictureInPicture = window
  if (!(video instanceof HTMLVideoElement) || !(typeof w.documentPictureInPicture?.requestWindow === 'function')) {
    return
  }
  const pipWindow = await w.documentPictureInPicture.requestWindow({
    width: video.clientWidth,
    height: video.clientHeight
  })

  styleSheets.forEach((s) => {
    if (s.ownerNode === null) {
      return
    }

    pipWindow.document.head.appendChild(s.ownerNode.cloneNode(true))
  })
  pipWindow.addEventListener('pagehide', () => {
    wrapper.appendChild(video)
  })
  pipWindow.document.body.appendChild(video)
}
