import React from 'react'
import { type SupportedType, isSupportedType } from '../scripts/types/record'

import { transcode } from '../scripts/utils/record/transcode'
import './button.css'

interface ButtonProps {
  disabled?: boolean
  children?: React.ReactNode
  onClick?: () => void
}

interface DownloadButtonProps extends ButtonProps {
  dataType: SupportedType
}

export const DownloadButton = ({ dataType, children, onClick, disabled }: DownloadButtonProps): JSX.Element => {
  if (!isSupportedType(dataType)) {
    return <></>
  }

  return (
    <button
      disabled={disabled} onClick={
      onClick ?? 
      
  }
    >{children}
    </button>
  )
}

export const UploadButton = (prop: ButtonProps): JSX.Element => <button disabled={prop.disabled}>업로드</button>
