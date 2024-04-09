export interface Option {
  pip?: boolean
  rec?: boolean
  fastRec?: boolean
  seek?: boolean
  screenshot?: boolean
  screenshotPreview?: boolean
  highFrameRateRec?: boolean
}

export type OptionInfo =
  Record<keyof Option,
  {
    name: string
    desc: string
  }
  >
