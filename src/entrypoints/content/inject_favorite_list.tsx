import { inject } from './inject_btn'

export function InjectFavoriteList () {
  const { options } = useOptions()

  return options.favorites ?? <FavoritesListPortal />
}

export function injectFavoriteListComponent () {
  const div = document.createElement('div')
  document.body.appendChild(div)
  inject(<FavoritesListPortal />, div)
}
