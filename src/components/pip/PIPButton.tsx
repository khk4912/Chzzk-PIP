import ReactDOM from 'react-dom'
import DocumentPIP from './DocumentPIP'

export function PIPPortal (): React.ReactNode {
  const target = usePortal({
    id: 'cheese-pip-pip-button',
    targetSelector: '.custom__clip-button',
    position: 'before'
  })

  return (
    <PIPPortalContainer target={target}>
      <DocumentPIP />
    </PIPPortalContainer>
  )
}

function PIPPortalContainer ({ target, children }: { target: Element | null, children: React.ReactNode }) {
  return target ? ReactDOM.createPortal(children, target) : null
}
