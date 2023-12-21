import { addButton, waitForElement } from './utils/inject_btns'
import { injectOverlay, updateOverlay } from './utils/overlay'

async function main (): Promise<void> {
  const btn = await waitForElement('.pzp-pc__bottom-buttons-right')
  addButton(btn as HTMLDivElement)
}

void main()
