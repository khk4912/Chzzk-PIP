import { addButton, recordShortcut, waitForElement } from './utils/inject_btns'

async function main (): Promise<void> {
  const btn = await waitForElement('.pzp-pc__bottom-buttons-right')
  addButton(btn as HTMLDivElement)

  document.addEventListener('keydown', recordShortcut)
}

void main()
