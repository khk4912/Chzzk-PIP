import { createRoot } from 'react-dom/client'
import { getOption } from '../types/options'
import { PIPButton } from './components/pip_button'

const getInjectTarget = (): HTMLElement | null => {
  return document.querySelector('.pzp-pc__bottom-buttons-right')
}

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
  const { pip, rec, screenshot } = await getOption()

  const tg = getInjectTarget()
  if (tg === null) {
    return
  }

  tg.classList.add('chzzk-pip-injected')

  if (pip) {
    await injectPIP(tg)
  }
}

async function injectPIP (buttonTarget: HTMLElement): Promise<void> {
  const div = document.createElement('div')
  div.id = 'chzzk-pip-pip-button'

  buttonTarget.insertBefore(div, buttonTarget.firstChild)

  inject(<PIPButton />, div)
}

function inject (node: React.ReactNode, target: HTMLElement): void {
  createRoot(target).render(node)
}
