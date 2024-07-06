import type { SupportedType } from '../../types/record'

import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile } from '@ffmpeg/util'

let videoDuration: number = 1

const FFMPEG_OPTION = {
  coreURL: chrome.runtime.getURL('ffmpeg/ffmpeg-core.js'),
  wasmURL: chrome.runtime.getURL('ffmpeg/ffmpeg-core.wasm'),
  workerURL: chrome.runtime.getURL('ffmpeg/ffmpeg-core.worker.js')
}

const ffmpeg = new FFmpeg()
ffmpeg.on('progress', ({ progress, time }) => {
  updateLoadBar(Math.floor(time / (videoDuration * 1000000) * 100))
})
ffmpeg.on('log', ({ message }) => { console.log(message) })

async function loadFFmpeg (): Promise<void> {
  if (ffmpeg.loaded) {
    ffmpeg.terminate()
  }

  await ffmpeg.load({ ...FFMPEG_OPTION })
}

export const transcode = async (
  inputFile: string,
  outputType: SupportedType,
  originalVideoDuration: number
): Promise<string> => {
  await loadFFmpeg()
  showLoadBar()

  videoDuration = originalVideoDuration

  switch (outputType) {
    case 'default':
      return await transcodeWEBM(inputFile)
    case 'gif':
      return await transcodeGIF(inputFile)
    case 'webp':
      return await transcodeWebP(inputFile)
    case 'mp4-aac':
      return await transcodeMP4AAC(inputFile)
    default:
      return await transcodeMP4(inputFile)
  }
}

const transcodeGIF = async (inputFileURL: string): Promise<string> => {
  const inputFile = await fetchFile(inputFileURL)

  await ffmpeg.writeFile('input.webm', inputFile)
  await ffmpeg.exec(['-i', 'input.webm', 'output.gif'])

  const data = await ffmpeg.readFile('output.gif')
  const url = URL.createObjectURL(new Blob([data], { type: 'image/gif' }))

  return url
}

const transcodeWebP = async (inputFileURL: string): Promise<string> => {
  const inputFile = await fetchFile(inputFileURL)

  await ffmpeg.writeFile('input.webm', inputFile)
  const vFilter = 'fps=' + '20' + ',scale=iw/100*' + '50' + ':-1:flags=lanczos'
  await ffmpeg.exec(['-i', 'input.webm', '-vf', vFilter, '-vcodec', 'libwebp', '-lossless', '0', '-compression_level', '5', '-q:v', '50', '-loop', '0', '-preset', 'picture', '-an', '-vsync', '0', 'output.webp'])

  // await ffmpeg.exec(['-i', 'input.webm', '-c:v', 'libwebp', '-compression_level', '6', 'output.webp'])

  const data = await ffmpeg.readFile('output.webp')
  const url = URL.createObjectURL(new Blob([data], { type: 'image/webp' }))

  return url
}

const transcodeMP4 = async (inputFileURL: string): Promise<string> => {
  const inputFile = await fetchFile(inputFileURL)

  await ffmpeg.writeFile('input.webm', inputFile)
  await ffmpeg.exec(['-i', 'input.webm', '-c', 'copy', 'output.mp4'])

  const data = await ffmpeg.readFile('output.mp4')
  const url = URL.createObjectURL(new Blob([data], { type: 'video/mp4' }))

  return url
}

const transcodeMP4AAC = async (inputFileURL: string): Promise<string> => {
  const inputFile = await fetchFile(inputFileURL)

  await ffmpeg.writeFile('input.webm', inputFile)
  await ffmpeg.exec(['-i', 'input.webm', '-c:a', 'aac', 'output.mp4'])

  const data = await ffmpeg.readFile('output.mp4')
  const url = URL.createObjectURL(new Blob([data], { type: 'video/mp4' }))

  return url
}

const transcodeWEBM = async (inputFileURL: string): Promise<string> => {
  const inputFile = await fetchFile(inputFileURL)

  await ffmpeg.writeFile('input.mp4', inputFile)
  await ffmpeg.exec(['-i', 'input.mp4', '-c', 'copy', 'output.webm'])

  const data = await ffmpeg.readFile('output.webm')
  const url = URL.createObjectURL(new Blob([data], { type: 'video/webm' }))

  return url
}

export const segmentize = async (inputFileURL: string, targetDuration: number, originalVideoDuration: number): Promise<string[]> => {
  await loadFFmpeg()

  videoDuration = originalVideoDuration
  showLoadBar()

  const inputFile = await fetchFile(inputFileURL)
  await ffmpeg.writeFile('input.webm', inputFile)

  await ffmpeg.exec(['-i', 'input.webm', '-c', 'copy', '-f', 'segment', '-segment_time', targetDuration.toString(), '-reset_timestamps', '1', 'output%03d.mp4'])

  const urls: string[] = []

  const files = await ffmpeg.listDir('.')
  for (const file of files) {
    if (file.name.startsWith('output') && file.name.endsWith('.mp4')) {
      const data = await ffmpeg.readFile(file.name)
      const url = URL.createObjectURL(new Blob([data], { type: 'video/mp4' }))
      urls.push(url)
    }
  }

  hideLoadBar()
  return urls
}

function showLoadBar (): void {
  const loadBar = document.querySelector('.transcode-loadbar')
  if (!(loadBar instanceof HTMLDivElement)) {
    return
  }
  updateLoadBar(0)
  loadBar.style.visibility = 'visible'
  loadBar.style.opacity = '1'
}

export function showUploadBar (): void {
  const uploadBar = document.querySelector('.transcode-uploadbar')
  if (!(uploadBar instanceof HTMLDivElement)) {
    return
  }
  updateUploadBar(0)
  uploadBar.style.visibility = 'visible'
  uploadBar.style.opacity = '1'
}

export function updateLoadBar (progress: number): void {
  const loadBar = document.querySelector('#loadbar-inner')
  const loadPercentSpan = document.querySelector('#loadPercent')

  if (!(loadBar instanceof HTMLDivElement &&
    loadPercentSpan instanceof HTMLSpanElement)) {
    return
  }

  loadPercentSpan.innerText = `${progress}%`
  loadBar.style.width = `${progress}%`
}

export function updateUploadBar (progress: number): void {
  const uploadBar = document.querySelector('#uploadInner')
  const uploadPercentSpan = document.querySelector('#uploadPercent')

  if (!(uploadBar instanceof HTMLDivElement &&
    uploadPercentSpan instanceof HTMLSpanElement)) {
    return
  }

  uploadPercentSpan.innerText = `${progress}%`
  uploadBar.style.width = `${progress}%`
}

export function hideLoadBar (): void {
  const loadBar = document.querySelector('.transcode-loadbar')

  if (!(loadBar instanceof HTMLDivElement)) {
    return
  }

  loadBar.style.visibility = 'hidden'
  loadBar.style.opacity = '0'
}

export function hideUploadBar (): void {
  const uploadBar = document.querySelector('.transcode-uploadbar')

  if (!(uploadBar instanceof HTMLDivElement)) {
    return
  }

  uploadBar.style.visibility = 'hidden'
  uploadBar.style.opacity = '0'
}

export async function mergeVideoWithAudio (inputFileURL: string, audioFileURL: string): Promise<string> {
  await loadFFmpeg()
  showLoadBar()
  updateLoadBar(0)

  const inputFile = await fetchFile(inputFileURL)
  const audioFile = await fetchFile(audioFileURL)

  await ffmpeg.writeFile('input.webm', inputFile)
  await ffmpeg.writeFile('audio.opus', audioFile)

  await ffmpeg.exec(['-i', 'input.webm', '-i', 'audio.opus', '-c', 'copy', 'output.webm'])

  const data = await ffmpeg.readFile('output.webm')
  const url = URL.createObjectURL(new Blob([data], { type: 'video/webm' }))

  hideLoadBar()
  return url
}

export async function slice (inputFileURL: string, start: number, duration: number): Promise<string> {
  await loadFFmpeg()
  showLoadBar()
  updateLoadBar(0)

  const inputFile = await fetchFile(inputFileURL)

  await ffmpeg.writeFile('input.webm', inputFile)
  await ffmpeg.exec(['-ss', String(start), '-i', 'input.webm', '-c', 'copy', '-t', String(duration), 'output.mp4'])

  const data = await ffmpeg.readFile('output.mp4')
  const url = URL.createObjectURL(new Blob([data], { type: 'video/mp4' }))

  hideLoadBar()
  return url
}

export async function getFrame (blobURL: string): Promise<string> {
  await loadFFmpeg()

  const inputFile = await fetchFile(blobURL)

  await ffmpeg.writeFile('input.webm', inputFile)
  await ffmpeg.exec(['-i', 'input.webm', '-ss', '00:00:01.00', '-vf', 'scale=1100:1100:force_original_aspect_ratio=decrease', '-vframes', '1', 'output.jpg'])

  const data = await ffmpeg.readFile('output.jpg')
  const url = URL.createObjectURL(new Blob([data], { type: 'image/jpeg' }))

  return url
}
