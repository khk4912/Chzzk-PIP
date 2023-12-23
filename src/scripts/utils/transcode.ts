// @ts-expect-error FFmpeg would be imported
const { createFFmpeg, fetchFile } = FFmpeg

const ffmpeg = createFFmpeg({
  mainName: 'main',
  corePath: chrome.runtime.getURL('ffmpeg/ffmpeg-core.js')
})

export const transcode = async (inputFile: string): Promise<string> => {
  if (ffmpeg.isLoaded() === true) {
    ffmpeg.exit()
  }

  await ffmpeg.load()

  ffmpeg.FS('writeFile', 'input.webm', await fetchFile(inputFile))
  await ffmpeg.run('-i', 'input.webm', '-c', 'copy', 'output.mp4')

  const data = ffmpeg.FS('readFile', 'output.mp4')
  const url = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }))

  return url
}
