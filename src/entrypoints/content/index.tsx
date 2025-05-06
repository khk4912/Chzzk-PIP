import { injectButton } from './inject_btn'
import { injectFavoriteListComponent } from './inject_favorite_list'

const contentScript = defineContentScript({
  matches: ['https://chzzk.naver.com/*'],
  main (_) {
    injectButton() // .catch(console.error)
    injectFavoriteListComponent()
  }
})

export default contentScript
