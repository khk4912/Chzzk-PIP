export interface Video extends HTMLVideoElement {
  captureStream: () => MediaStream
}

export interface StreamInfo {
  streamerName: string
  streamTitle: string
}

export interface HighFPSRecorder {
  videoRecorder: MediaRecorder
  audioRecorder: MediaRecorder
  canvasInterval: NodeJS.Timeout
}

const SupportedTypeList = ['webm', 'webp', 'gif', 'mp4', 'mp4-aac'] as const

export type SupportedType = typeof SupportedTypeList[number]
export const isSupportedType = (type: string): type is SupportedType =>
  SupportedTypeList.includes(type as SupportedType)
