import { waitForElement } from '../inject_btn'

export async function setMaxHQ (): Promise<void> {
  const x = await waitForElement('.pzp-setting-quality-pane__list-container > ul > li') as HTMLLIElement
  x.replaceWith(x.cloneNode(true))
  x.click()
}
