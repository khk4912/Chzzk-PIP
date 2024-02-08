export interface Video extends HTMLMediaElement {
  captureStream: () => MediaStream
}

export interface StreamInfo {
  streamerName: string
  streamTitle: string
}

const SupportedTypeList = ['webm', 'webp', 'gif', 'mp4', 'mp4-aac'] as const

export type SupportedType = typeof SupportedTypeList[number]
export const isSupportedType = (type: string): type is SupportedType =>
  SupportedTypeList.includes(type as SupportedType)
