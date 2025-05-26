import ReactDOM from 'react-dom'

export function PIPPortal ({ tg }: { tg: Element | undefined }): React.ReactNode {
  if (tg === undefined) {
    return null
  }

  const div = document.createElement('div')
  div.id = 'cheese-pip-pip-button'

  tg.insertBefore(div, tg.firstChild)
  return ReactDOM.createPortal(<DocumentPIP targetElementQuerySelector='video' />, div)
}

// Commented out code removed for clarity as it appears to be superseded by DocumentPIP.tsx
// and related functionalities. If this logic is still needed, it should be re-evaluated
// and potentially integrated into the new component structure.
