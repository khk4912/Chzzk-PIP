export interface StreamInfo {
  streamTitle: string
  streamerName: string
}

export interface RecordInfo {
  startDateTime: number // new Date().getTime()
  stopDateTime: number
  resultBlobURL: string
  streamInfo: StreamInfo
}

export interface DownloadInfo {
  recordInfo: RecordInfo
  length: number
  fileName: string
}
