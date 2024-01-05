import { waitForElement, addButton } from './inject_btns'
import { registerSeekHandler } from '../seek/seek'

async function main (): Promise<void> {
  await waitForElement('.pzp-pc__bottom-buttons-right')

  addButton()
  void registerSeekHandler()
}

export const injectButton = (): void => {
  let oldHref = window.location.href
  const body = document.querySelector('body') as HTMLElement

  const inject = (): void => {
    void main()
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
