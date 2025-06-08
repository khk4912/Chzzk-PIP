import { inject } from './inject_btn'

function InjectFavoriteList () {
  const { options } = useOptions()
  if (!options?.favorites) { return null }

  return <FavoritesListPortal />
}

export function injectFavoriteListComponent () {
  const div = document.createElement('div')
  div.id = 'cheese-pip-favorites-list-portal'
  document.body.appendChild(div)
  inject(<InjectFavoriteList />, div)
}
