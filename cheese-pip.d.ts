interface HTMLVideoElement {
  captureStream: () => MediaStream
  mozCaptureStream: () => MediaStream
}

interface RecordInfoBase {
  startDateTime: number // new Date().getTime()
  stopDateTime: number
  resultBlobURL: string
  streamInfo: StreamInfo
  isMP4: boolean
  highFrameRec?: boolean
  audioBlobURL?: string
}

interface HighFPSRecordInfo extends RecordInfoBase {
  highFrameRec?: true
  audioBlobURL: string
}

interface LowFPSRecordInfo extends RecordInfoBase {
  highFrameRec?: false // Set the type to 'false' for highFrameRec
  audioBlobURL?: undefined // Set the type to 'undefined' for audioBlobURL
}

type RecordInfo = HighFPSRecordInfo | LowFPSRecordInfo

interface MediaRecorder {
  tempBlobURL?: string
  recordInfo?: RecordInfo
  stopFlag?: boolean
  blobSize?: number
  videoBlob?: Blob[]
}

/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />
/// <reference types="navigation-api-types" />
/// <reference types="../cheese-pip" />
