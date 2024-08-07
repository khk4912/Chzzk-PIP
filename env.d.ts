/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />
/// <reference types="navigation-api-types" />

interface HTMLVideoElement {
  captureStream: () => MediaStream
  mozCaptureStream: () => MediaStream
}

interface MediaRecorder {
  tempBlobURL?: string
  recordInfo?: {
    startDateTime: number
    stopDateTime: number
    resultBlobURL: string
    streamInfo: StreamInfo
    isMP4: boolean
  }

}
