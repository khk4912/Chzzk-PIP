import ReactDOM from 'react-dom'
// Removed FollowingItem, getFavorites, removeFavorite imports as they are now handled by useFavorites hook.
// Unimport will handle useState, useEffect for FavoritesListPortal and the isExpanded logic if still used there.
import type { FollowingItem } from '@/types/follows'
import { useFavorites } from '@/hooks/useFavorites' // Import the new hook

export function FavoritesListPortal ({ tg }: { tg: Element | undefined }): React.ReactNode {
  // useMemo and useEffect for portal div creation can remain if unimport handles them.
  // Otherwise, explicit imports might be needed if unimport is not configured for them.
  // For this refactor, we assume unimport handles useState, useEffect, useMemo if they are used here.
  const div = useMemo(() => {
    const el = document.createElement('div')
    el.id = 'cheese-pip-favorites-list'

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

/**
 * Renders the list of favorite channels.
 * It uses the useFavorites hook to fetch and manage favorite channel data.
 * The component also observes the navigation panel's expanded state to adjust its rendering.
 */
function FavoritesList (): React.ReactElement | null {
  const [isExpanded, setIsExpanded] = useState(true) // State for UI presentation
  const { favoriteChannels, isLoading, error } = useFavorites() // Use the new hook

  // Effect for observing navigation panel's expanded state (UI specific)
  useEffect(() => {
    const targetNav = document.querySelector('nav#navigation')
    if (!targetNav) {
      // If targetNav is not found, perhaps set isExpanded to a default or handle appropriately
      setIsExpanded(false) // Example: default to collapsed if nav not found
      return
    }

    // Set initial state based on current class
    setIsExpanded(targetNav.className.includes('is_expanded'))

    const observer = new MutationObserver(() => {
      setIsExpanded(targetNav.className.includes('is_expanded'))
    })
    observer.observe(targetNav, { attributes: true, attributeFilter: ['class'] })

    return () => observer.disconnect()
  }, []) // Empty dependency array: runs once on mount

  if (isLoading) {
    // Optional: Render a specific loading indicator for the favorites list itself
    // For now, returning null or a minimal placeholder if it's part of a larger loading UI.
    // If isExpanded is true, show a loading message.
    return isExpanded ? (
      <div className={`navigator_wrapper__ruh6f ${isExpanded ? 'navigator_is_expanded__4Q1h9' : ''}`} style={{ paddingBottom: isExpanded ? '5px' : '' }}>
        <div className='navigator_header__inwmE'>
          <h2 className='navigator_title__9RhVJ'>즐겨찾기 로딩 중...</h2>
        </div>
      </div>
    ) : null;
  }

  if (error) {
    // Optional: Render a specific error message
    console.error('Error in FavoritesList:', error.message)
    return isExpanded ? (
      <div className={`navigator_wrapper__ruh6f ${isExpanded ? 'navigator_is_expanded__4Q1h9' : ''}`} style={{ paddingBottom: isExpanded ? '5px' : '' }}>
        <div className='navigator_header__inwmE'>
          <h2 className='navigator_title__9RhVJ'>즐겨찾기 오류</h2>
        </div>
        <p style={{ padding: '0 10px', color: 'red' }}>{error.message}</p>
      </div>
    ) : null;
  }

  if (favoriteChannels.length === 0) {
    // If there are no favorite channels, don't render the section.
    // Optionally, a "No favorites yet" message could be shown if isExpanded.
    return null
  }

  return (
    <div className={`navigator_wrapper__ruh6f ${isExpanded ? 'navigator_is_expanded__4Q1h9' : ''}`} style={{ paddingBottom: isExpanded ? '5px' : '' }}>
      {isExpanded
        ? (
          <div className='navigator_header__inwmE'>
            <h2 className='navigator_title__9RhVJ'>팔로우 즐겨찾기 (beta)</h2>
          </div>
          )
        : <h2 className='navigator_title__9RhVJ'>즐겨찾기</h2>}
      {favoriteChannels.map(channel => (
        isExpanded
          ? <ExpandedChannelItem key={channel.channelId} channel={channel} />
          : <CollapsedChannelItem key={channel.channelId} channel={channel} />
      ))}
    </div>
  )
}

function ExpandedChannelItem ({ channel }: { channel: FollowingItem }) {
  return (
    <div className='navigator_list__cHnuV'>
      <a className='navigator_item__qXlq9' href={`/live/${channel.channelId}`}>
        <div className={`navigator_profile__kAP2J ${channel.streamer.openLive ? 'navigator_is_live__jJiBO' : 'navigator_default__Hk5Qm'}`}>
          <img
            width='26' height='26'
            src={channel.channel.channelImageUrl ?? 'https://ssl.pstatic.net/cmstatic/nng/img/img_anonymous_square_gray_opacity2x.png?type=f120_120_na'}
            className={`navigator_image__T5dSp ${!channel.streamer.openLive ? 'navigator_default__Hk5Qm' : ''}`}
            alt=''
          />
        </div>
        <div className='navigator_information__cMqxQ'>
          <strong className='navigator_name__AhZMz'>
            <span className='name_ellipsis__Hu9B+ name_-nemony_ellipsis__ibvhb'>
              <span className='name_text__yQG50'>{channel.channel.channelName}</span>
            </span>
          </strong>
        </div>
      </a>
    </div>
  )
}

function CollapsedChannelItem ({ channel }: { channel: FollowingItem }) {
  return (
    <div className='navigator_list__cHnuV'>
      <a className='navigator_item__qXlq9' href={`/live/${channel.channelId}`}>
        <div className={`navigator_profile__kAP2J ${channel.streamer.openLive ? 'navigator_is_live__jJiBO' : 'navigator_default__Hk5Qm'}`}>
          <img
            width='26' height='26'
            src={channel.channel.channelImageUrl ?? 'https://ssl.pstatic.net/cmstatic/nng/img/img_anonymous_square_gray_opacity2x.png?type=f120_120_na'}
            className={`navigator_image__T5dSp ${!channel.streamer.openLive ? 'navigator_default__Hk5Qm' : ''}`}
            alt={channel.channel.channelName}
          />
        </div>
      </a>
    </div>
  )
}
