import React, { useEffect, useState } from 'react'
import './record.css'
import { createRoot } from 'react-dom/client'
import { DownloadButton, UploadButton } from '../../components/button'
import type { StreamInfo } from '../../scripts/types/record'

export interface ResultContextData {
  recorderBlob: string
  streamInfo: StreamInfo
  recorderStartTime: number
  recorderStopTime: number
  duration?: number

}

const Header = ({ children }: { children: React.ReactNode }): JSX.Element => {
  return (
    <>
      <span id='header'>녹화 완료!</span>
      {children}
    </>
  )
}

const DefaultActions = ({ children }: { children: React.ReactNode }): JSX.Element => (
  <>
    <div className='default-actions'>
      {children}
    </div>
  </>
)

const TranscodeActions = ({ children }: { children: React.ReactNode }): JSX.Element => (
  <>
    <div className='transcode-actions'>
      <h3 id='transcode-note'>변환 작업 후 다운로드</h3>

      <div className='actions'>
        {children}
      </div>
    </div>
  </>
)

function Record (): JSX.Element {
  const [resultContext, setResultContext] = useState<ResultContextData | null>(null)
  const [canDownload, setCanDownload] = useState<boolean>(false)

  useEffect(
    () => {
      const fetch = async (): Promise<void> => {
        const context = await chrome.storage.local.get(
          [
            'recorderBlob',
            'streamInfo',
            'recorderStartTime',
            'recorderStopTime'
          ]) as ResultContextData

        if (context.recorderBlob === undefined ||
            typeof context.recorderBlob !== 'string'
        ) {
          return
        }

        setResultContext(context)
        setCanDownload(true)
      }
      void fetch()
    }
    , [])

  return (
    <>
      <Header>
        <video
          muted controls preload='metadata' src={resultContext?.recorderBlob}
          onLoadedMetadata={canDownload
            ? handleMetadata(resultContext, setResultContext)
            : undefined}
        />
      </Header>

      <div className='buttons'>

        <DefaultActions>
          <DownloadButton disabled={!canDownload} context={resultContext} dataType='webm'>다운로드</DownloadButton>
          <UploadButton disabled={!canDownload} />
        </DefaultActions>
        <TranscodeActions>
          <DownloadButton disabled={!canDownload} context={resultContext} dataType='mp4'>MP4</DownloadButton>
          <DownloadButton disabled={!canDownload} context={resultContext} dataType='mp4-aac'>MP4 (AAC, 느림)</DownloadButton>
          <DownloadButton disabled={!canDownload} context={resultContext} dataType='gif'>GIF</DownloadButton>
          <DownloadButton disabled={!canDownload} context={resultContext} dataType='webp'>WebP</DownloadButton>
        </TranscodeActions>

      </div>
    </>

  )
}

const root = document.getElementById('root')
if (root !== null) {
  createRoot(root).render(
    <React.StrictMode>
      <Record />
    </React.StrictMode>
  )
}
function handleMetadata (resultContext: ResultContextData | null, setVideoDuration: React.Dispatch<React.SetStateAction<ResultContextData | null>>): React.ReactEventHandler<HTMLVideoElement> | undefined {
  return e => {
    const video = e.target as HTMLVideoElement
    if (resultContext === null) {
      return
    }

    void (async () => {
      video.currentTime = Number.MAX_SAFE_INTEGER
      await new Promise(resolve => setTimeout(resolve, 500))
      video.currentTime = 0

      let duration = video.duration
      if (duration === Infinity) {
        duration = (resultContext?.recorderStopTime - resultContext?.recorderStopTime) / 1000 - 0.1
      }

      setVideoDuration((prev) => {
        if (prev === null) {
          return null
        }

        return {
          ...prev,
          duration
        }
      })
    })()
  }
}
