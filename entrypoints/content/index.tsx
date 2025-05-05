import { injectButton } from './inject_btn'
import { injectFavoriteListComponent } from './inject_favorite_list'

export default defineContentScript({
  matches: ['https://chzzk.naver.com/*'],
  main (_) {
    injectButton() // .catch(console.error)
    injectFavoriteListComponent()
  }
})
