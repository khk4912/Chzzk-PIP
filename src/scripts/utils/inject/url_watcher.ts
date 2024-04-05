import { waitForElement, addButton } from './inject_btns'
import { registerSeekHandler } from '../seek/seek'

async function main (): Promise<void> {
  await waitForElement('.pzp-pc__bottom-buttons-right').catch()

  addButton()
  void registerSeekHandler()
}

export const injectButton = (): void => {
  // const oldHref = window.location.href
  // const body = document.querySelector('body') as HTMLE
  const inject = (): void => {
    void main()
  }

  inject()
  window.navigation.addEventListener('navigate', inject)
  // const _observer = new MutationObserver(() => {
  //   if (oldHref !== window.location.href) {
  //     oldHref = window.location.href
  //     inject()
  //   }
  // })

  // _observer.observe(body, {
  //   childList: true,
  //   subtree: true
  // })
}
