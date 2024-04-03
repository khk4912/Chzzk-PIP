import type { Option } from '../../types/option'

const DEFAULT_OPTIONS: Record<keyof Option, boolean> = {
  pip: false,
  rec: true,
  fastRec: false,
  seek: false,
  screenshot: true,
  screenshotPreview: true,
  highFrameRateRec: false
}

export const getOption = async (): Promise<typeof DEFAULT_OPTIONS> => {
  const option: Option = (await chrome.storage.local.get('option'))?.option ?? {}
  const result = { ...DEFAULT_OPTIONS }

  for (const key in option) {
    if (key in DEFAULT_OPTIONS) {
      const k = key as keyof Option
      result[k] = option[k] ?? DEFAULT_OPTIONS[k]
    }
  }

  return result
}

export const setOption = async (option: keyof Option, value: boolean): Promise<void> => {
  const options: Option = (await chrome.storage.local.get('option'))?.option ?? {}
  options[option] = value
  await chrome.storage.local.set({ option: options })
}
