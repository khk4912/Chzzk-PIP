export interface Video extends HTMLMediaElement {
  captureStream: () => MediaStream
  mozCaptureStream: () => MediaStream
}

export interface StreamInfo {
  streamerName: string
  streamTitle: string
}

const SupportedTypeList = ['default', 'webp', 'gif', 'mp4', 'mp4-aac'] as const

export type SupportedType = typeof SupportedTypeList[number]
export const isSupportedType = (type: string): type is SupportedType =>
  SupportedTypeList.includes(type as SupportedType)

export interface HighFrameRecorder {
  videoMediaRecorder: MediaRecorder
  audioMediaRecorder: MediaRecorder
  highFrameCanvasInterval: NodeJS.Timeout
}
