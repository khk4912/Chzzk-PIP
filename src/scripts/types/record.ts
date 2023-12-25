export interface Video extends HTMLMediaElement {
  captureStream: () => MediaStream
}

export interface StreamInfo {
  streamerName: string
  streamTitle: string
}
