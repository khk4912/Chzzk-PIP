import { waitForElement, addButton } from './inject_btns'
import { registerSeekHandler } from '../seek/seek'

async function main (): Promise<void> {
  const x = await waitForElement('.pzp-pc__bottom-buttons-right').catch(() => null)

  if (x === null) {
    return
  }

  addButton()
  void registerSeekHandler()
}

export const injectButton = (): void => {
  const isMoz = navigator.userAgent.includes('Firefox')
  const inject = (): void => {
    void main()
  }

  if (isMoz) {
    inject()

    let oldHref = window.location.href
    const body = document.querySelector('body') as HTMLElement

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

    return
  }

  inject()
  window.navigation.addEventListener('navigate', inject)
}
