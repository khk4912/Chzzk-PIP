import React from 'react'
import { type SupportedType, isSupportedType } from '../types/record'

import './button.css'

interface ButtonProps {
  children?: React.ReactNode
  onClick?: () => void
}

interface DownloadButtonProps extends ButtonProps {
  dataType: SupportedType
}

export const DownloadButton = ({ dataType, children, onClick }: DownloadButtonProps): JSX.Element => {
  if (!isSupportedType(dataType)) {
    return <></>
  }

  return (
    <button onClick={onClick}>{children}</button>
  )
}

export const UploadButton = (prop: ButtonProps): JSX.Element => <button>업로드</button>
