import { createRoot } from 'react-dom/client'
import { getOption } from '../types/options'
import { PIPButton } from './components/pip_button'
import { RecordButton } from './components/rec_button'
import { ScreenshotButton } from './components/screenshot_button'

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
  const tg = await waitForElement('.pzp-pc__bottom-buttons-right') as HTMLElement

  if (tg.classList.contains('chzzk-pip-injected')) {
    return
  }

  const { pip, rec, screenshot } = await getOption()

  tg.classList.add('chzzk-pip-injected')

  if (pip) {
    await injectPIP(tg)
  }

  if (screenshot) {
    await injectScreenshot(tg)
  }

  if (rec) {
    await injectRec(tg)
  }
}

async function injectPIP (buttonTarget: HTMLElement): Promise<void> {
  const div = document.createElement('div')
  div.id = 'chzzk-pip-pip-button'

  buttonTarget.insertBefore(div, buttonTarget.firstChild)

  inject(<PIPButton />, div)
}

async function injectRec (buttonTarget: HTMLElement): Promise<void> {
  const div = document.createElement('div')
  div.id = 'chzzk-pip-rec-button'

  buttonTarget.insertBefore(div, buttonTarget.firstChild)

  inject(<RecordButton />, div)
}

async function injectScreenshot (buttonTarget: HTMLElement): Promise<void> {
  const div = document.createElement('div')
  div.id = 'chzzk-pip-screenshot-button'

  buttonTarget.insertBefore(div, buttonTarget.firstChild)

  inject(<ScreenshotButton />, div)
}

function inject (node: React.ReactNode, target: HTMLElement): void {
  createRoot(target).render(node)
}
