import { addButton, waitForElement } from './utils/inject_btns'
import { startRecord, stopRecord, type Video } from './utils/record_stream'

async function main (): Promise<void> {
  const btn = await waitForElement('.pzp-pc__bottom-buttons-right')
  addButton(btn as HTMLDivElement)

  const video = await waitForElement('.webplayer-internal-video')
  // await new Promise(resolve => setTimeout(resolve, 5000))
  // console.log('start')
  // const recorder = await startRecord(video as Video)

  // await new Promise(resolve => setTimeout(resolve, 10000))
  // await stopRecord(recorder)
}

void main()
