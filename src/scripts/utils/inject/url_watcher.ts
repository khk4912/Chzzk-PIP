import { waitForElement, addButton } from './inject_btns'
import { registerSeekHandler } from '../seek/seek'

const injectState = {
  stream: false,
  vod: false
}

const isStream = (): boolean => {
  return window.location.pathname.startsWith('/live')
}

const isVOD = (): boolean => {
  return window.location.pathname.startsWith('/video')
}

async function main (): Promise<void> {
  await waitForElement('.pzp-pc__bottom-buttons-right')
  addButton()

  void registerSeekHandler()
}

export const injectButton = (): void => {
  let oldHref = window.location.href
  const body = document.querySelector('body') as HTMLElement

  const inject = (): void => {
    const vod = isVOD()
    const stream = isStream()

    if ((vod && !injectState.vod) ||
      (stream && !injectState.stream)
    ) {
      injectState.vod = vod
      injectState.stream = stream

      void main()
    }
  }

  inject()

  const _observer = new MutationObserver(() => {
    if (oldHref !== window.location.href) {
      oldHref = window.location.href
      inject()
    }
  })

  _observer.observe(body, {
    childList: true,
    subtree: true
  })
}
