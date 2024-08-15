import { createRoot, type Root } from 'react-dom/client'
import { InjectButtons } from './portal_handler'

import { ClipsDownloadButton } from './components/clips_download_button'

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
  const div = document.createElement('div')
  div.id = 'chzzk-pip-clips-download-button'

  const tg = await waitForElement('.si_tool_box')
  tg?.insertBefore(div, tg.lastChild)

  console.log(tg, div)

  let root = inject(<ClipsDownloadButton />, div)

  window.navigation?.addEventListener('navigate', () => {
    root.unmount()
    div.remove()

    const newDiv = document.createElement('div')
    newDiv.id = 'chzzk-pip-clips-download-button'

    tg?.insertBefore(newDiv, tg.lastChild)
    root = inject(<ClipsDownloadButton />, newDiv)
  })
}

function inject (node: React.ReactNode, target: HTMLElement): Root {
  const root = createRoot(target)
  root.render(node)

  return root
}
