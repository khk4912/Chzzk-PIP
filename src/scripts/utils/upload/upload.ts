import { updateLoadBar } from '../record/transcode'

const BASE_URL = 'https://chzzk-pip.kosame.dev'

interface UploadResponse {
  status: string
  key: string
}

interface StatusResponse {
  status: string
  maxSize: number
}

export async function checkStatus (): Promise<StatusResponse> {
  const response = await fetch(`${BASE_URL}/status`)
  const data = await response.json() as StatusResponse

  if (data.status !== 'ok') {
    throw new Error('Failed to check status')
  }

  return data
}

export async function upload (blob: Blob): Promise<UploadResponse> {
  const totalSize = blob.size
  let uploadedSize = 0

  const trackStream = new TransformStream(
    {
      transform (chunk, controller) {
        controller.enqueue(chunk)

        uploadedSize += chunk.byteLength as number
        const progress = Math.floor(uploadedSize / totalSize * 100)
        updateLoadBar(progress)
      }
    }
  )

  const response = await fetch(`${BASE_URL}/upload`, {
    method: 'POST',
    body: blob.stream().pipeThrough(trackStream),
    headers: {
      'Content-Type': 'application/octet-stream'
    },
    // @ts-expect-error - TS doesn't know about this option
    duplex: 'half'
  })

  if (response.status !== 200) {
    throw new Error('Failed to upload')
  }

  return await response.json()
}
