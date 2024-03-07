import { getOption } from '../options/option_handler'
import { getStreamInfo } from '../stream_info'
import { createDraggablePreview } from './preview'

const pad = (num: number | string): string => {
  return num.toString().padStart(2, '0')
}

export async function screenshot (): Promise<void> {
  const { streamerName, streamTitle } = getStreamInfo(document)

  const video = document.querySelector('video')
  if (!(video instanceof HTMLVideoElement)) {
    return
  }

  const canvas = document.createElement('canvas')
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight

  const ctx = canvas.getContext('2d')
  if (ctx === null) {
    return
  }

  ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

  const image = canvas.toDataURL('image/png')

  if (image === 'data:,') {
    return
  }

  const now = new Date()
  const date = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`

  const fileName = `${streamerName}_${streamTitle}_${date}.png`
  const { screenshotPreview } = await getOption()

  if (screenshotPreview) {
    createDraggablePreview(image, video, fileName)
  } else {
    const a = document.createElement('a')
    a.href = image
    a.download = fileName

    a.click()
  }
}
