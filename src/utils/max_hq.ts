import { waitForElement } from '../inject_btn'

export async function setMaxHQ (): Promise<void> {
  const x = await waitForElement('.pzp-pc-setting-quality-pane__list-container > li') as HTMLLIElement
  x.click()
}
