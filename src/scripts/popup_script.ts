import type { Option } from './types/option'

const [pipSwitch, recSwitch, fastSaveSwitch] =
  document.querySelectorAll('input[type="checkbox"]')

function init (): void {
  if (!(pipSwitch instanceof HTMLInputElement &&
    recSwitch instanceof HTMLInputElement &&
    fastSaveSwitch instanceof HTMLInputElement)) {
    return
  }

  void (async () => {
    const option: Option = (await chrome.storage.local.get('option'))?.option ?? {}

    pipSwitch.checked = option?.pip ?? true
    recSwitch.checked = option?.rec ?? true
    fastSaveSwitch.checked = option?.fastRec ?? false
  })()
}

async function handleChange (e: Event): Promise<void> {
  if (!(e.target instanceof HTMLInputElement)) {
    return
  }

  if (!(pipSwitch instanceof HTMLInputElement &&
    recSwitch instanceof HTMLInputElement &&
    fastSaveSwitch instanceof HTMLInputElement)) {
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
  }
}

init()
document.addEventListener('change', (e) => {
  void (async () => {
    await handleChange(e)
  })()
})
