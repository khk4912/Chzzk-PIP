import React, { createContext, useContext, useEffect, useState } from 'react'
import './record.css'
import { createRoot } from 'react-dom/client'
import { DownloadButton, UploadButton } from '../../components/button'
import type { StreamInfo } from '../../types/record'

interface ResultContextData {
  data: {
    recorderBlob: string
    streamInfo: StreamInfo
    recorderStartTime: number
    recorderStopTime: number
    duration?: number
  }
  setContext: (context: ResultContextData['data']) => void

}

const ResultContext = createContext({})

const Header = (): JSX.Element => {
  const { data } = useContext(ResultContext)

  return (
    <>
      <span id='header'>녹화 완료!</span>
      <video muted controls src={data?.recorderBlob} id='vid' />
    </>
  )
}

const DefaultActions = (): JSX.Element => (
  <>
    <div className='default-actions'>
      <DownloadButton dataType='webm'>다운로드</DownloadButton>
      <UploadButton />
    </div>
  </>
)

const TranscodeActions = (): JSX.Element => (
  <>
    <div className='transcode-actions'>
      <h3 id='transcode-note'>변환 작업 후 다운로드</h3>

      <div className='actions'>
        <DownloadButton dataType='mp4'>MP4</DownloadButton>
        <DownloadButton dataType='mp4-aac'>MP4 (AAC, 느림)</DownloadButton>
        <DownloadButton dataType='gif'>GIF</DownloadButton>
        <DownloadButton dataType='webp'>WebP</DownloadButton>
      </div>
    </div>
  </>
)

function Record (): JSX.Element {
  const [resultContext, setResultContext] = useState<ResultContextData | null>(null)
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
      }
      void fetch()
    }
    , [])

  return (
    <ResultContext.Provider>
      <Header />

      <div className='buttons'>
        <DefaultActions />
        <TranscodeActions />
      </div>
    </ResultContext.Provider>
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
