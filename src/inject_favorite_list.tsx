import { useEffect, useState } from 'react'
import { inject, waitForElement } from './inject_btn'
import { DEFAULT_OPTIONS, getOption } from '../types/options'
import { FavoritesListPortal } from './components/FavoritesList'

export function InjectFavoriteList () {
  const [options, setOptions] = useState<typeof DEFAULT_OPTIONS>()
  const [favoritesListTarget, setFavoritesListTarget] = useState<Element>()

  useEffect(() => {
    getOption()
      .then(setOptions)
      .catch(console.error)
  }, [])

  // 즐겨찾기 리스트
  useEffect(() => {
    if (options?.favorites) {
      waitForElement('[class^="header_service"]')
        .then(setFavoritesListTarget)
        .catch(console.error)
    }
  }, [options?.favorites])

  if (!options?.favorites) { return null }

  return <FavoritesListPortal tg={favoritesListTarget} />
}

export function injectFavoriteListComponent () {
  const div = document.createElement('div')
  div.id = 'chzzk-pip-favorites-list-portal'
  document.body.appendChild(div)
  inject(<InjectFavoriteList />, div)
}
