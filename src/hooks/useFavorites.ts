/**
 * @file useFavorites.ts
 * @description 즐겨찾기 채널 목록을 가져오고 관리하는 React Hook입니다.
 */

import { useState, useEffect, useCallback } from 'react'
import { getFavorites, removeFavorite } from '@/types/options'
import type { FollowApiResponse, FollowingItem } from '@/types/follows' // Assuming types are correctly pathed

/**
 * 팔로우 중인 채널 목록을 가져옵니다.
 * Chzzk API를 직접 호출합니다.
 * @returns API 응답 Promise.
 */
const getFollowedChannels = async (): Promise<FollowApiResponse> => {
  const res = await fetch(
    'https://api.chzzk.naver.com/service/v1/channels/followings?page=0&size=505&sortType=FOLLOW',
    { credentials: 'include' }
  )
  if (res.status !== 200) {
    // API 호출 실패 시, 빈 목록과 함께 오류 코드를 반환합니다.
    console.error('Failed to fetch followed channels, status:', res.status)
    return {
      code: res.status,
      message: `Error fetching followed channels: ${res.statusText}`,
      content: {
        totalCount: 0,
        totalPage: 0,
        followingList: []
      }
    }
  }
  return (await res.json()) as FollowApiResponse
}

/**
 * `useFavorites` 훅의 반환 값 타입입니다.
 */
interface UseFavoritesResult {
  /**
   * 즐겨찾기된 채널 목록입니다.
   */
  favoriteChannels: FollowingItem[];
  /**
   * 데이터를 불러오는 중인지 여부를 나타냅니다.
   */
  isLoading: boolean;
  /**
   * 데이터 로딩 중 발생한 오류 객체입니다. 오류가 없으면 null입니다.
   */
  error: Error | null;
  /**
   * 즐겨찾기 목록을 수동으로 새로고침하는 함수입니다.
   */
  refreshFavorites: () => Promise<void>;
}

const POLLING_INTERVAL = 30000 // 30초

/**
 * 즐겨찾기된 채널 목록을 가져오고, 주기적으로 업데이트하며, 스토리지 변경 사항을 감지하여
 * 자동으로 목록을 갱신하는 커스텀 Hook입니다.
 *
 * @returns `{ favoriteChannels: FollowingItem[], isLoading: boolean, error: Error | null, refreshFavorites: () => Promise<void> }` 객체.
 */
export function useFavorites (): UseFavoritesResult {
  const [favoriteChannels, setFavoriteChannels] = useState<FollowingItem[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchAndProcessFavorites = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const storedFavoritesSet = await getFavorites()
      const followedChannelsResponse = await getFollowedChannels()

      if (followedChannelsResponse.code !== 200 && followedChannelsResponse.code !== 0) { // 0 is often used by mock/custom responses for success
        // API 응답 객체에 message 필드가 있다고 가정합니다.
        throw new Error(followedChannelsResponse.message || `Failed to fetch followed channels: ${followedChannelsResponse.code}`)
      }
      
      const allFollowedChannels = followedChannelsResponse.content.followingList

      // 즐겨찾기에 추가된 채널만 필터링합니다.
      const currentFavoriteChannels = allFollowedChannels.filter(channel =>
        storedFavoritesSet.has(channel.channelId)
      )

      // 스토리지의 즐겨찾기 목록과 실제 팔로우 목록을 동기화합니다.
      // (팔로우 취소된 채널을 즐겨찾기에서 제거)
      const allFollowedChannelIds = new Set(allFollowedChannels.map(ch => ch.channelId))
      let updatedInStorage = false
      for (const favId of Array.from(storedFavoritesSet)) {
        if (!allFollowedChannelIds.has(favId)) {
          await removeFavorite(favId) // 스토리지에서 제거
          storedFavoritesSet.delete(favId) // 로컬 Set에서도 제거하여 즉시 반영
          updatedInStorage = true
        }
      }
      // `updatedInStorage` 플래그는 현재 사용되지 않지만, 추후 로직 확장에 사용될 수 있습니다.
      // (예: 특정 조건에서만 UI를 강제 새로고침하거나 알림을 표시하는 등)
      // 현재는 `storedFavoritesSet.delete(favId)`를 통해 즉시 로컬 Set에 변경사항을 반영하여,
      // `currentFavoriteChannels` 필터링 시 정확한 목록을 사용하도록 합니다.
      
      // openLive (방송 중) 상태인 채널을 위로 정렬합니다.
      currentFavoriteChannels.sort((a, _) => (a.streamer?.openLive ? -1 : 1))
      setFavoriteChannels(currentFavoriteChannels)
    } catch (err) {
      console.error('Error processing favorites:', err)
      setError(err instanceof Error ? err : new Error('An unknown error occurred'))
      setFavoriteChannels([]) // 오류 발생 시 목록을 비웁니다.
    } finally {
      setIsLoading(false)
    }
  }, []) // useCallback의 의존성 배열은 비어있음. 내부에서 사용하는 함수들은 안정적이거나 이미 useCallback으로 감싸져 있어야 함.

  // 초기 데이터 로드 및 폴링 설정
  useEffect(() => {
    fetchAndProcessFavorites().catch(console.error) // 초기 로드

    const intervalId = setInterval(() => {
      fetchAndProcessFavorites().catch(console.error)
    }, POLLING_INTERVAL)

    return () => {
      clearInterval(intervalId)
    }
  }, [fetchAndProcessFavorites]) // fetchAndProcessFavorites가 변경될 때마다 effect 재실행

  // 스토리지 변경 감지
  useEffect(() => {
    const handleStorageChange = (
      changes: { [key: string]: chrome.storage.StorageChange },
      areaName: string
    ) => {
      if (areaName === 'local' && changes.favorites) {
        // 'favorites' 키가 변경되었을 때만 즐겨찾기 목록을 새로고침합니다.
        fetchAndProcessFavorites().catch(console.error)
      }
    }

    chrome.storage.onChanged.addListener(handleStorageChange)

    return () => {
      chrome.storage.onChanged.removeListener(handleStorageChange)
    }
  }, [fetchAndProcessFavorites]) // fetchAndProcessFavorites가 변경될 때마다 effect 재실행

  return { favoriteChannels, isLoading, error, refreshFavorites: fetchAndProcessFavorites }
}
