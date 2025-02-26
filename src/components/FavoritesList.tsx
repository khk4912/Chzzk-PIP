import ReactDOM from 'react-dom'
import { useEffect, useMemo, useState } from 'react'

export function FavoritesListPortal ({ tg }: { tg: Element | undefined }): React.ReactNode {
  const div = useMemo(() => {
    const el = document.createElement('div')
    el.id = 'chzzk-pip-favorites-list'

    return el
  }, [])

  useEffect(() => {
    if (tg === undefined) {
      return
    }

    tg.parentNode?.insertBefore(div, tg.nextSibling)

    return () => {
      div.remove()
    }
  }, [tg, div])

  if (tg === undefined) {
    return null
  }

  return ReactDOM.createPortal(<FavoritesList />, div)
}

function FavoritesList (): React.ReactNode {
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    const targetNav = document.querySelector('nav#navigation')
    if (targetNav === null || targetNav === undefined) {
      return
    }

    setIsExpanded(targetNav.className.includes('expanded'))
  }, [])

  return (
    <>
      {isExpanded && (
        <div>
          {/* TODO */}
        </div>
      )}
    </>

  )
}
