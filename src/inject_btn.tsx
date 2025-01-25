import { createRoot, type Root } from 'react-dom/client'
import { InjectButtons } from './portal_handler'

import { ClipsDownloadButton } from './components/clips_download_button'
import { isShortsPage } from './utils/download/download'

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
export async function injectButton (): Promise<void> {
  const tg = await waitForElement('.pzp-pc__bottom-buttons-right') as HTMLElement

  let div = document.createElement('div')
  div.id = 'chzzk-pip-buttons'

  tg.insertBefore(div, tg.firstChild)

  let root = inject(<InjectButtons />, div)

  if (isMoz) {
    root.unmount()
    div.remove()

    let oldHref = window.location.href
    const body = document.querySelector('body') as HTMLElement

    const _observer = new MutationObserver(() => {
      if (oldHref !== window.location.href) {
        oldHref = window.location.href

        div = document.createElement('div')
        div.id = 'chzzk-pip-buttons'

        tg.insertBefore(div, tg.firstChild)
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
    div.id = 'chzzk-pip-buttons'

    tg.insertBefore(div, tg.firstChild)
    root = inject(<InjectButtons />, div)
  })
}

/**
 * Shorts (클립) 페이지에 다운로드 버튼을 주입합니다.
 */
export async function injectShortsDownloadButton (): Promise<void> {
  if (!isShortsPage()) {
    return
  }

  await waitForElement('.si_tool_box')

  const isCurrent = document.querySelector('.flicking-camera')
  const toolBoxes = document.querySelectorAll('.si_tool_box')

  const divs: Element[] = []
  const roots: Root[] = []

  // 여러 toolbox가 존재, 모든 toolbox에 버튼 주입
  for (const toolBox of toolBoxes) {
    const div = document.createElement('div')
    div.id = 'chzzk-shorts-download-button'

    toolBox.insertBefore(div, toolBox.lastChild)

    divs.push(div)
    roots.push(inject(<ClipsDownloadButton />, div))
  }

  if (isCurrent === null) {
    return
  }

  // toolbox가 추가되거나 삭제될 때마다 버튼 재주입
  const observer = new MutationObserver((mutationLists) => {
    mutationLists.forEach((mutation) => {
      if (mutation.type !== 'childList') {
        return
      }

      divs.forEach((div) => {
        div.remove()
      })

      roots.forEach((root) => {
        root.unmount()
      })

      const toolBoxes = document.querySelectorAll('.si_tool_box')

      for (const toolBox of toolBoxes) {
        const div = document.createElement('div')
        div.id = 'chzzk-shorts-download-button'

        toolBox.insertBefore(div, toolBox.lastChild)

        divs.push(div)
        roots.push(inject(<ClipsDownloadButton />, div))
      }
    })
  })

  // 현재 보여지는 camera 감시, camera 내부가 바뀔 때마다 버튼 재주입
  observer.observe(isCurrent, { childList: true, attributes: true })
}

function inject (node: React.ReactNode, target: HTMLElement): Root {
  const root = createRoot(target)
  root.render(node)

  return root
}
