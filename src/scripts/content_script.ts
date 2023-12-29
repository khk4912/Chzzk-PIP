import { addButton, recordShortcut, waitForElement } from './utils/inject/inject_btns'
import { registerSeekHandler } from './utils/seek/seek'

async function main (): Promise<void> {
  const btn = await waitForElement('.pzp-pc__bottom-buttons-right')
  addButton(btn as HTMLDivElement)

  document.addEventListener('keydown', recordShortcut)
  registerSeekHandler()
}

void main()
