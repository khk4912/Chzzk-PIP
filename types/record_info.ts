export interface StreamInfo {
  streamTitle: string
  streamerName: string
}

export interface RecordInfo {
  startDateTime: number // new Date().getTime()
  stopDateTime: number
  resultBlobURL: string
  streamInfo: StreamInfo
  isMP4: boolean
  chunks?: Blob[] // temp stroed chunks, would not be sent to page
}

export interface DownloadInfo {
  recordInfo: RecordInfo
  length: number
  fileName: string
}
