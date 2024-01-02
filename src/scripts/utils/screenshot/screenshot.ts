const pad = (num: number | string): string => {
  return num.toString().padStart(2, '0')
}

export function screenshot (): void {
  const streamerName = document.querySelector("[class^='video_information'] > [class^='name_ellipsis']")?.textContent ??
                       document.querySelector("[class^='live_information'] > [class^='name_ellipsis']")?.textContent ??
                       'streamer'
  const streamTitle = document.querySelector("[class^='video_information_title']")?.textContent ?? 'title'

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
  const a = document.createElement('a')

  const now = new Date()
  const date = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`

  a.href = image
  a.download = `${streamerName}_${streamTitle}_${date}.png`
  a.click()
}
