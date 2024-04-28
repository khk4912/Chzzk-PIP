import React from 'react'
import { type SupportedType, isSupportedType } from '../scripts/types/record'
import './button.css'
import type { ResultContextData } from '../pages/record/record'
import { transcode } from '../scripts/utils/record/transcode'

interface ButtonProps {
  disabled?: boolean
  children?: React.ReactNode
  onClick?: () => void
  context?: ResultContextData | null
}

interface DownloadButtonProps extends ButtonProps {
  dataType: SupportedType
}

function startDownload (recorderBlobURL: string, fileName: string): void {
  const a = document.createElement('a')
  a.href = recorderBlobURL
  a.download = fileName
  a.click()
}

export const getFileName = (context: ResultContextData, dataType: SupportedType): string => {
  const { streamInfo } = context

  const streamerName = streamInfo.streamerName
  let duration = context.duration

  if (duration === undefined || Number.isNaN(duration)) {
    duration = 0
  }

  return `${streamerName}_${duration}s.${dataType}`
}

async function downloadAfterTranscode (context: ResultContextData, dataType: SupportedType): Promise<void> {
  if (context === null) {
    return
  }

  // FIXME: 뭔가 설계가 잘못된 것 같다.
  const duration = context.duration ?? 45

  const blob = await transcode(context.recorderBlob, dataType, duration)
  startDownload(blob, getFileName(context, dataType))
}

async function download (context: ResultContextData, dataType: SupportedType): Promise<void> {
  if (context === null) {
    return
  }

  switch (dataType) {
    case 'webm':
      startDownload(context.recorderBlob, getFileName(context, 'webm'))
      break
    case 'webp':
    case 'gif':
    case 'mp4':
    case 'mp4-aac':
      await downloadAfterTranscode(context, dataType)
      break
  }
}

export const DownloadButton = ({ dataType, children, onClick, disabled, context }: DownloadButtonProps): JSX.Element => {
  if (!isSupportedType(dataType)) {
    return <></>
  }

  if (context === null || context === undefined) {
    return <></>
  }

  return (
    <button
      disabled={disabled} onClick={
      () => { void download(context, dataType) }
  }
    >{children}
    </button>
  )
}

export const UploadButton = (prop: ButtonProps): JSX.Element => <button disabled={prop.disabled}>업로드</button>
