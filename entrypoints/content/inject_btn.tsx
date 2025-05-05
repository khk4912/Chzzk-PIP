import { createRoot, type Root } from 'react-dom/client'
import { InjectButtons } from './portal_handler'

export const waitForElement = async (querySelector: string): Promise<Element> => {
  return await new Promise((resolve) => {
    const interval = setInterval(() => {
      const element = document.querySelector(querySelector)
      if (element !== null) {
        clearInterval(interval)
        resolve(element)
      }
    }, 100)
  })
}

const isMoz = navigator.userAgent.includes('Firefox')
/**
 * InjectButtons 컴포넌트를 목표 위치에 주입합니다.
 */
export function injectButton () {
  // const tg = await waitForElement('.pzp-pc__bottom-buttons-right') as HTMLElement

  let div = document.createElement('div')
  div.id = 'cheese-pip-buttons'

  document.body.appendChild(div)

  let root = inject(<InjectButtons />, div)

  if (isMoz) {
    let oldHref = window.location.href
    const body = document.querySelector('body') as HTMLElement

    const _observer = new MutationObserver(() => {
      if (oldHref !== window.location.href) {
        root.unmount()
        div.remove()

        oldHref = window.location.href

        div = document.createElement('div')
        div.id = 'cheese-pip-buttons'

        document.body.appendChild(div)
        root = inject(<InjectButtons />, div)
      }
    })

    _observer.observe(body, {
      childList: true,
      subtree: true
    })

    return
  }

  window.navigation?.addEventListener('navigate', () => {
    root.unmount()
    div.remove()

    div = document.createElement('div')
    div.id = 'cheese-pip-buttons'

    // tg.insertBefore(div, tg.firstChild)
    document.body.appendChild(div)
    root = inject(<InjectButtons />, div)
  })
}

export function inject (node: React.ReactNode, target: HTMLElement): Root {
  const root = createRoot(target)
  root.render(node)

  return root
}
