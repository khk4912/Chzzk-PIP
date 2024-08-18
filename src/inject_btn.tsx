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

export async function injectButton (): Promise<void> {
  const tg = await waitForElement('.pzp-pc__bottom-buttons-right') as HTMLElement

  let div = document.createElement('div')
  div.id = 'chzzk-pip-buttons'

  tg.insertBefore(div, tg.firstChild)

  let root = inject(<InjectButtons />, div)

  window.navigation?.addEventListener('navigate', () => {
    root.unmount()
    div.remove()

    div = document.createElement('div')
    div.id = 'chzzk-pip-buttons'

    tg.insertBefore(div, tg.firstChild)
    root = inject(<InjectButtons />, div)
  })
}

export async function injectShortsDownloadButton (): Promise<void> {
  if (!isShortsPage()) {
    return
  }

  await waitForElement('.si_tool_box')

  const isCurrent = document.querySelector('.flicking-camera')
  const toolBoxes = document.querySelectorAll('.si_tool_box')

  const divs: Element[] = []
  const roots: Root[] = []

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

  observer.observe(isCurrent, { childList: true, attributes: true })
}

function inject (node: React.ReactNode, target: HTMLElement): Root {
  const root = createRoot(target)
  root.render(node)

  return root
}
