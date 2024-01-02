import type { Option } from './types/option'

const [pipSwitch, recSwitch, screenshotSwitch, fastSaveSwitch, seekSwitch] =
  document.querySelectorAll('input[type="checkbox"]')

const isInputElement = (element: Element): element is HTMLInputElement => {
  return element instanceof HTMLInputElement
}

function init (): void {
  if (
    !(
      isInputElement(pipSwitch) && isInputElement(recSwitch) &&
      isInputElement(screenshotSwitch) && isInputElement(fastSaveSwitch) &&
      isInputElement(seekSwitch)
    )
  ) {
    return
  }
  void (async () => {
    const option: Option = (await chrome.storage.local.get('option'))?.option ?? {}

    pipSwitch.checked = option?.pip ?? true
    recSwitch.checked = option?.rec ?? true
    screenshotSwitch.checked = option?.screenshot ?? false
    fastSaveSwitch.checked = option?.fastRec ?? false
    seekSwitch.checked = option?.seek ?? false
  })()
}

async function handleChange (e: Event): Promise<void> {
  if (!(e.target instanceof HTMLInputElement)) {
    return
  }

  const option: Option = (await chrome.storage.local.get('option'))?.option ?? {}

  switch (e.target) {
    case pipSwitch:
      option.pip = e.target.checked
      await chrome.storage.local.set({ option })
      break
    case recSwitch:
      console.log('recSwitch')
      option.rec = e.target.checked
      await chrome.storage.local.set({ option })
      break
    case fastSaveSwitch:
      option.fastRec = e.target.checked
      await chrome.storage.local.set({ option })
      break
    case seekSwitch:
      option.seek = e.target.checked
      await chrome.storage.local.set({ option })
      break
    case screenshotSwitch:
      option.screenshot = e.target.checked
      await chrome.storage.local.set({ option })
      break
  }
}

init()
document.addEventListener('change', (e) => {
  void (async () => {
    await handleChange(e)
  })()
})
