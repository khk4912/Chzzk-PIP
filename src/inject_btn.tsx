import { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { createRoot, type Root } from 'react-dom/client'

import { type DEFAULT_OPTIONS, getOption } from '../types/options'
import { PIPButton } from './components/pip_button'
import { RecordButton } from './components/rec_button'
import { ScreenshotButton } from './components/screenshot_button'

const waitForElement = async (querySelector: string): Promise<Element> => {
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

function PIPPortal ({ tg }: { tg: Element | undefined }): React.ReactNode {
  if (tg === undefined) {
    return null
  }

  const div = document.createElement('div')
  div.id = 'chzzk-pip-pip-button'

  tg.insertBefore(div, tg.firstChild)
  return ReactDOM.createPortal(<PIPButton />, div)
}

function RecordPortal ({ tg }: { tg: Element | undefined }): React.ReactNode {
  if (tg === undefined) {
    return null
  }

  const div = document.createElement('div')
  div.id = 'chzzk-pip-rec-button'

  tg.insertBefore(div, tg.firstChild)
  return ReactDOM.createPortal(<RecordButton />, div)
}

function ScreenShotPortal ({ tg }: { tg: Element | undefined }): React.ReactNode {
  if (tg === undefined) {
    return null
  }

  const div = document.createElement('div')
  div.id = 'chzzk-pip-screenshot-button'

  tg.insertBefore(div, tg.firstChild)
  return ReactDOM.createPortal(<ScreenshotButton />, div)
}

export function inject (node: React.ReactNode, target: HTMLElement): Root {
  const root = createRoot(target)
  root.render(node)

  return root
}

function InjectButtons (): React.ReactNode {
  const [target, setTarget] = useState<Element | undefined>(undefined)
  const [options, setOptions] = useState<typeof DEFAULT_OPTIONS>()

  useEffect(() => {
    getOption()
      .then(setOptions)
      .catch(console.error)
  }, [])

  useEffect(() => {
    if (target === undefined) {
      waitForElement('.pzp-pc__bottom-buttons-right')
        .then(setTarget)
        .catch(console.error)
    }
  }, [target])

  return (
    <>
      {((options?.pip) ?? false) && <PIPPortal tg={target} />}
      {((options?.screenshot) ?? false) && <ScreenShotPortal tg={target} />}
      {((options?.rec) ?? false) && <RecordPortal tg={target} />}
    </>
  )
}
