/**
 * @file useScreenshot.ts
 * @description HTMLVideoElement로부터 스크린샷을 촬영하는 커스텀 React Hook입니다.
 */

import { getStreamInfo, type StreamInfo } from '@/utils/stream_info' // 경로 및 타입 가정
import { download } from '@/utils/download' // 경로 가정
import { yyyymmddhhmmss, sanitizeFileName } from '@/utils/string_utils'

/**
 * `takeScreenshot` 함수에 전달할 수 있는 선택적 파라미터입니다.
 */
export interface TakeScreenshotOptions {
  /**
   * 파일명에 사용될 커스텀 스트림 정보입니다.
   * 제공되지 않으면, Hook은 `getStreamInfo(document)`를 사용하여 스트림 정보를 가져옵니다.
   */
  customStreamInfo?: StreamInfo;
  /**
   * 커스텀 파일명 (확장자 제외)입니다.
   * 제공되면, 기본 파일명 생성 로직을 재정의합니다.
   * 파일명은 여전히 안전하게 처리(sanitize)됩니다.
   */
  customFilename?: string;
}

/**
 * 주어진 HTMLVideoElement에서 스크린샷을 캡처하는 기능을 제공합니다.
 *
 * @returns `takeScreenshot` 비동기 함수를 포함하는 객체입니다.
 */
export function useScreenshot () {
  /**
   * 제공된 비디오 요소에서 프레임을 캡처하고, 파일명을 생성한 후,
   * 이미지 다운로드를 트리거합니다.
   *
   * @param videoElement - 스크린샷을 캡처할 HTMLVideoElement입니다.
   * @param options - 스크린샷 동작을 사용자 정의하기 위한 선택적 파라미터입니다.
   * @returns 스크린샷 처리가 시도될 때 resolve되는 Promise입니다.
   */
  const takeScreenshot = async (
    videoElement: HTMLVideoElement,
    options?: TakeScreenshotOptions
  ): Promise<void> => {
    if (!(videoElement instanceof HTMLVideoElement)) {
      console.error('Invalid video element provided for screenshot.')
      return
    }

    try {
      const canvas = document.createElement('canvas')
      canvas.width = videoElement.videoWidth
      canvas.height = videoElement.videoHeight

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        console.error('Failed to get 2D context from canvas for screenshot.')
        return
      }

      ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height)
      const dataURL = canvas.toDataURL('image/png')

      let title: string

      if (options?.customFilename) {
        title = options.customFilename
      } else {
        const info = options?.customStreamInfo ?? getStreamInfo(document)
        const dateStr = yyyymmddhhmmss(new Date())
        title = `${info.streamerName}_${info.streamTitle}_${dateStr}`
      }

      await download(dataURL, sanitizeFileName(title), 'png')
    } catch (error) {
      console.error('Error taking screenshot:', error)
      // Optionally re-throw or handle more specifically if needed
    }
  }

  return {
    takeScreenshot
  }
}
