export interface MessageType {
  type: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any
}

export interface DownloadMessage extends MessageType {
  type: 'download'
  data: {
    url: string
    fileName: string
  }
}
