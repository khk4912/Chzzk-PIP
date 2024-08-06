import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile } from '@ffmpeg/util'
import { useEffect, useRef, useState } from 'react'

const FFMPEG_OPTION = {
  coreURL: chrome.runtime.getURL('ffmpeg/ffmpeg-core.js'),
  wasmURL: chrome.runtime.getURL('ffmpeg/ffmpeg-core.wasm'),
  workerURL: chrome.runtime.getURL('ffmpeg/ffmpeg-core.worker.js')
}

export function useFFmpeg (): readonly [React.MutableRefObject<FFmpeg>, boolean] {
  const ffmpeg = useRef<FFmpeg>(new FFmpeg())

  ffmpeg.current.on('log', ({ message }) => { console.log(message) })

  const [isReady, setIsReady] = useState(false)
  useEffect(() => {
    ffmpeg.current.load({ ...FFMPEG_OPTION })
      .then(
        () => {
          console.log('Loaded!')
          setIsReady(true)
        }
      )
      .catch(console.log)
  }, [])

  return [ffmpeg, isReady] as const
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
  return await _transcode(ffmpeg, inputFileURL, 'output.webp', ['-c', 'copy'])
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
