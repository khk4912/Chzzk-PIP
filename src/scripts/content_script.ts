import { addButton, waitForElement } from './utils/inject/inject_btns'
import { registerSeekHandler } from './utils/seek/seek'

async function main (): Promise<void> {
  await waitForElement('.pzp-pc__bottom-buttons-right')

  addButton()
  void registerSeekHandler()
}

void main()
