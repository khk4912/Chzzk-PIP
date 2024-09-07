interface BooleanOptions {
  pip?: boolean
  rec?: boolean
  fastRec?: boolean
  seek?: boolean
  screenshot?: boolean
  screenshotPreview?: boolean
  highFrameRateRec?: boolean
  preferMP4?: boolean
}

export interface OtherOptions {
  videoBitsPerSecond?: number
}

export interface Option extends BooleanOptions, OtherOptions { }
export const DEFAULT_OPTIONS: Option = {
  pip: false,
  rec: true,
  fastRec: false,
  seek: false,
  screenshot: true,
  screenshotPreview: true,
  highFrameRateRec: false,
  preferMP4: false,
  videoBitsPerSecond: 8000000
} as const

export const getOption = async (): Promise<Option> => {
  const option = (await chrome.storage.local.get('option'))?.option ?? {}
  const result = { ...DEFAULT_OPTIONS }

  for (const key in option) {
    if (key in DEFAULT_OPTIONS) {
      const k = key as keyof Option
      result[k] = option[k] ?? DEFAULT_OPTIONS[k]
    }
  }

  return result
}

export const setOption = async <T extends keyof Option>(option: T, value: NonNullable<Option[T]>): Promise<void> => {
  const options = (await chrome.storage.local.get('option'))?.option ?? {}
  options[option] = value

  await chrome.storage.local.set({ option: options })
}
