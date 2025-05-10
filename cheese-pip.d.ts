/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />
/// <reference types="navigation-api-types" />
/// <reference types="../cheese-pip" />

/* eslint-disable @typescript-eslint/no-explicit-any */

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

// Document Picture-in-Picture
// Specification: https://wicg.github.io/document-picture-in-picture/
// Repository: https://github.com/WICG/document-picture-in-picture

declare let documentPictureInPicture: DocumentPictureInPicture

declare class DocumentPictureInPicture extends EventTarget {
  requestWindow (options?: DocumentPictureInPictureOptions): Promise<Window>
  readonly window: Window
  onenter: ((this: DocumentPictureInPicture, ev: DocumentPictureInPictureEvent) => any) | null
  addEventListener<K extends keyof DocumentPictureInPictureEventMap>(type: K, listener: (this: DocumentPictureInPicture, ev: DocumentPictureInPictureEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void
  addEventListener (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void
  removeEventListener<K extends keyof DocumentPictureInPictureEventMap>(type: K, listener: (this: DocumentPictureInPicture, ev: DocumentPictureInPictureEventMap[K]) => any, options?: boolean | EventListenerOptions): void
  removeEventListener (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void
}

interface DocumentPictureInPictureEventMap {
  center: DocumentPictureInPictureEvent;
}

interface DocumentPictureInPictureOptions {
  width?: number
  height?: number
  disallowReturnToOpener?: boolean
  preferInitialWindowPlacement?: boolean
}

declare class DocumentPictureInPictureEvent {
  constructor (type: string, eventInitDict: DocumentPictureInPictureEventInit)
  readonly window: Window
}

interface DocumentPictureInPictureEventInit {
  window: Window;
}

interface Window {
  documentPictureInPicture: DocumentPictureInPicture
}
