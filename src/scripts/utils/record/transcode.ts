import type { SupportedType } from '../../types/record'

// @ts-expect-error FFmpeg would be imported
const { createFFmpeg, fetchFile } = FFmpeg

const ffmpeg = createFFmpeg({
  log: true,
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

  switch (outputType) {
    case 'gif':
      return await transcodeGIF(inputFile)
    case 'webp':
      return await transcodeWebP(inputFile)
    default:
      return await transcodeMP4(inputFile)
  }
}

const transcodeGIF = async (inputFileURL: string): Promise<string> => {
  const inputFile = await fetchFile(inputFileURL)

  ffmpeg.FS('writeFile', 'input.webm', inputFile)
  await ffmpeg.run('-i', 'input.webm', '-ss', '30', '-t', '3', '-vf', 'fps=10,scale=320:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse"', '-c', 'copy', 'output.gif')

  const data = ffmpeg.FS('readFile', 'output.gif')
  const url = URL.createObjectURL(new Blob([data.buffer], { type: 'image/gif' }))

  return url
}

const transcodeWebP = async (inputFileURL: string): Promise<string> => {
  const inputFile = await fetchFile(inputFileURL)

  ffmpeg.FS('writeFile', 'input.webm', inputFile)
  const vFilter = 'fps=' + '10' + ',scale=iw/100*' + '50' + ':-1:flags=lanczos'
  await ffmpeg.run('-i', 'input.webm', '-vf', vFilter, '-vcodec', 'libwebp', '-lossless', '0', '-compression_level', '6', '-q:v', '50', '-loop', '0', '-preset', 'picture', '-an', '-vsync', '0', 'output.webp')
  const data = ffmpeg.FS('readFile', 'output.webp')
  const url = URL.createObjectURL(new Blob([data.buffer], { type: 'image/webp' }))

  return url
}

const transcodeMP4 = async (inputFileURL: string): Promise<string> => {
  const inputFile = await fetchFile(inputFileURL)

  ffmpeg.FS('writeFile', 'input.webm', inputFile)
  await ffmpeg.run('-i', 'input.webm', '-c', 'copy', 'output.mp4')

  const data = ffmpeg.FS('readFile', 'output.mp4')
  const url = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }))

  return url
}
f
export const segmentize = async (inputFileURL: string, targetDuration: number): Promise<string[]> => {
  if (ffmpeg.isLoaded() === true) {
    ffmpeg.exit()
  }

  await ffmpeg.load()

  const inputFile = await fetchFile(inputFileURL)

  ffmpeg.FS('writeFile', 'input.webm', inputFile)

  await ffmpeg.run('-i', 'input.webm', '-c:v', 'libx264', '-crf', '22', '-f', 'segment', '-force_key_frames', '"expr:gte(t,n_forced*9)"', '-segment_time', targetDuration.toString(), '-reset_timestamps', '1', '-map', '0', 'output%03d.webm')

  const urls: string[] = []

  const files = ffmpeg.FS('readdir', '.')
  files.forEach((fileName: string) => {
    console.log(fileName)

    if (!fileName.startsWith('output')) {
      return
    }

    const data = ffmpeg.FS('readFile', fileName)
    urls.push(URL.createObjectURL(new Blob([data.buffer], { type: 'video/webm' })))
  })

  return urls
}
