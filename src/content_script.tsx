import { injectButton } from './inject_btn'
import { injectFavoriteListComponent } from './inject_favorite_list'

function main () {
  injectButton() // .catch(console.error)
  injectFavoriteListComponent()
}

main()
