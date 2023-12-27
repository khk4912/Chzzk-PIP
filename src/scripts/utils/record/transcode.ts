import type { SupportedType } from '../../types/record'

// @ts-expect-error FFmpeg would be imported
const { createFFmpeg, fetchFile } = FFmpeg

const ffmpeg = createFFmpeg({
  mainName: 'main',
  corePath: chrome.runtime.getURL('ffmpeg/ffmpeg-core.js')
})

export const transcode = async (
  inputFile: string,
  outputType: SupportedType
): Promise<string> => {
  if (ffmpeg.isLoaded() === true) {
    ffmpeg.exit()
  }

  await ffmpeg.load()

  const outputFileName = `output.${outputType}`
  const blobType = outputType === 'gif'
    ? 'image/gif'
    : 'video/{outputType}'

  ffmpeg.FS('writeFile', 'input.webm', await fetchFile(inputFile))
  await ffmpeg.run('-i', 'input.webm', '-c', 'copy', outputFileName)

  const data = ffmpeg.FS('readFile', outputFileName)
  const url = URL.createObjectURL(new Blob([data.buffer], { type: blobType }))

  return url
}
