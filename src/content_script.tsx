import { injectButton, waitForElement } from './inject_btn'

async function main (): Promise<void> {
  const button = await waitForElement('.pzp-pc__bottom-buttons-right').catch(() => null)

  if (button === null) {
    return
  }

  await injectButton()
}

main().catch(console.error)
