import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile } from '@ffmpeg/util'
import { useEffect, useRef, useState } from 'react'

const FFMPEG_OPTION = {
  coreURL: chrome.runtime.getURL('ffmpeg/ffmpeg-core.js'),
  wasmURL: chrome.runtime.getURL('ffmpeg/ffmpeg-core.wasm'),
  workerURL: chrome.runtime.getURL('ffmpeg/ffmpeg-core.worker.js')
}

export function useFFmpeg (): readonly [React.MutableRefObject<FFmpeg>, boolean, number] {
  const ffmpeg = useRef<FFmpeg>(new FFmpeg())

  const [isReady, setIsReady] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    ffmpeg.current.load({ ...FFMPEG_OPTION })
      .then(
        () => {
          ffmpeg.current.on('log', ({ message }) => { console.log(message) })
          ffmpeg.current.on('progress', ({ progress }) => { setProgress(progress * 100) })
          setIsReady(true)
        }
      )
      .catch(console.log)
  }, [])

  return [ffmpeg, isReady, progress] as const
}

export async function toMP4 (ffmpeg: FFmpeg, inputFileURL: string): Promise<string> {
  return await _transcode(ffmpeg, inputFileURL, 'output.mp4', ['-c', 'copy'])
}

export async function toMP4AAC (ffmpeg: FFmpeg, inputFileURL: string): Promise<string> {
  return await _transcode(ffmpeg, inputFileURL, 'output.mp4', ['-c:a', 'aac'])
}

export async function toGIF (ffmpeg: FFmpeg, inputFileURL: string): Promise<string> {
  return await _transcode(ffmpeg, inputFileURL, 'output.gif', ['-vf', 'fps=30,scale=320:-1'])
}

export async function toWEBP (ffmpeg: FFmpeg, inputFileURL: string): Promise<string> {
  return await _transcode(ffmpeg, inputFileURL, 'output.webp', ['-c:v', 'webp'])
}

async function _transcode (
  ffmpeg: FFmpeg,
  inputFileURL: string,
  outputFileName: string,
  args: string[],
  type?: string): Promise<string> {
  const input = await fetchFile(inputFileURL)
  await ffmpeg.writeFile('input.webm', input)

  await ffmpeg.exec(['-i', 'input.webm', ...args, outputFileName])
  const output = await ffmpeg.readFile(outputFileName)

  return URL.createObjectURL(new Blob([output], { type: type === undefined ? 'video/mp4' : `video/${type}` }))
}

export async function segmentize (ffmpeg: FFmpeg, inputFileURL: string, targetSegmentTime: number): Promise<string[]> {
  const input = await fetchFile(inputFileURL)
  await ffmpeg.writeFile('input.webm', input)
  await ffmpeg.exec(['-i', 'input.webm', '-map', '0', '-f', 'segment', '-segment_time', targetSegmentTime.toString(), '-c', 'copy', '-reset_timestamps', '1', 'output%03d.mp4'])

  const output: string[] = []

  const files = await ffmpeg.listDir('.')
  for (const file of files) {
    if (file.name.startsWith('output') && file.name.endsWith('.mp4')) {
      const data = await ffmpeg.readFile(file.name)
      output.push(URL.createObjectURL(new Blob([data], { type: 'video/mp4' })))
    }
  }

  return output
}

export async function trim (ffmpeg: FFmpeg, inputFileURL: string, start: number, end: number): Promise<string> {
  const input = await fetchFile(inputFileURL)
  await ffmpeg.writeFile('input.webm', input)

  await ffmpeg.exec(['-i', 'input.webm', '-ss', start.toString(), '-to', end.toString(), '-c', 'copy', 'output.mp4'])
  const output = await ffmpeg.readFile('output.mp4')

  return URL.createObjectURL(new Blob([output], { type: 'video/mp4' }))
}
