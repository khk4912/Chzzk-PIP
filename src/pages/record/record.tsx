
import React, { useEffect, useState } from 'react'
import './record.css'
import { createRoot } from 'react-dom/client'
import { DownloadButton, UploadButton } from '../../components/button'
import type { StreamInfo } from '../../scripts/types/record'

interface ResultContextData {
  recorderBlob: string
  streamInfo: StreamInfo
  recorderStartTime: number
  recorderStopTime: number
  duration?: number

}

const Header = (prop: { recorderBlob: string }): JSX.Element => {
  return (
    <>
      <span id='header'>녹화 완료!</span>
      <video muted controls src={prop.recorderBlob} id='vid' />
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

        setResultContext(context)
        setCanDownload(true)
      }
      void fetch()
    }
    , [])

  return (
    <>
      <Header recorderBlob={resultContext?.recorderBlob ?? ''} />

      <div className='buttons'>

        <DefaultActions>
          <DownloadButton disabled={!canDownload} dataType='webm'>다운로드</DownloadButton>
          <UploadButton disabled={!canDownload} />
        </DefaultActions>
        <TranscodeActions>
          <DownloadButton disabled={!canDownload} dataType='mp4'>MP4</DownloadButton>
          <DownloadButton disabled={!canDownload} dataType='mp4-aac'>MP4 (AAC, 느림)</DownloadButton>
          <DownloadButton disabled={!canDownload} dataType='gif'>GIF</DownloadButton>
          <DownloadButton disabled={!canDownload} dataType='webp'>WebP</DownloadButton>
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
