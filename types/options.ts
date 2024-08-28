export interface Option {
  pip?: boolean
  rec?: boolean
  fastRec?: boolean
  seek?: boolean
  screenshot?: boolean
  screenshotPreview?: boolean
  highFrameRateRec?: boolean
  preferMP4?: boolean
}

export const DEFAULT_OPTIONS: Record<keyof Option, boolean> = {
  pip: false,
  rec: true,
  fastRec: false,
  seek: false,
  screenshot: true,
  screenshotPreview: true,
  highFrameRateRec: false,
  preferMP4: false
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
