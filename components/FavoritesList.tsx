import ReactDOM from 'react-dom'
import { useEffect, useMemo, useState } from 'react'
import { FollowApiResponse, FollowingItem } from '../types/follows'
import { getFavorites, removeFavorite } from '../types/options'

const getFollowedChannels = async (): Promise<FollowApiResponse> => {
  const res = await fetch(
    'https://api.chzzk.naver.com/service/v1/channels/followings?page=0&size=505&sortType=FOLLOW',
    { credentials: 'include' }
  )
  // check 401
  if (res.status !== 200) {
    return {
      code: res.status,
      message: 'Error',
      content: {
        totalCount: 0,
        totalPage: 0,
        followingList: []
      }
    }
  }

  return (await res.json()) as FollowApiResponse
}

export function FavoritesListPortal ({ tg }: { tg: Element | undefined }): React.ReactNode {
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

function FavoritesList (): React.ReactElement | null {
  const [isExpanded, setIsExpanded] = useState(true)
  const [favoriteChannels, setFavoriteChannels] = useState<FollowingItem[]>([])

  const fetchFavorites = async () => {
    try {
      const favorites = await getFavorites()
      const res = await getFollowedChannels()
      const followingChannels = res.content.followingList

      // 즐겨찾기에 추가된 채널만 필터링
      const favoriteChannels = followingChannels.filter(channel => favorites.has(channel.channelId))

      // favorites 에는 있지만, followingChannels 에는 없는 경우 favorites에서 삭제
      const followingChannelIds = followingChannels.map(channel => channel.channelId)
      const toRemove = [...favorites].filter(channelId => !followingChannelIds.includes(channelId))

      await Promise.all(toRemove.map(channelId => removeFavorite(channelId)))
      toRemove.forEach(channelId => favorites.delete(channelId))

      // openLive 가 true 인 채널을 위로 정렬
      favoriteChannels.sort((a, _) => (a.streamer.openLive ? -1 : 1))
      setFavoriteChannels(favoriteChannels)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    const interval = setInterval(() => { fetchFavorites().catch(console.error) }, 30000)

    return () => {
      window.clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    const storageChanged = (changes: { [key: string]: chrome.storage.StorageChange }, areaName: string) => {
      if (areaName !== 'local') return

      if (changes.favorites) {
        fetchFavorites().catch(console.error)
      }
    }

    fetchFavorites().catch(console.error)

    // storage change event listener 등록
    chrome.storage.onChanged.addListener(storageChanged)

    return () => {
      chrome.storage.onChanged.removeListener(storageChanged)
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => { fetchFavorites().catch(console.error) }, 300000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const targetNav = document.querySelector('nav#navigation')
    if (!targetNav) return

    setIsExpanded(targetNav.className.includes('is_expanded'))

    const observer = new MutationObserver(() => {
      setIsExpanded(targetNav.className.includes('is_expanded'))
    })
    observer.observe(targetNav, { attributes: true, attributeFilter: ['class'] })

    return () => observer.disconnect()
  }, [])

  if (favoriteChannels.length === 0) return null

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
