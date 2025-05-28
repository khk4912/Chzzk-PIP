import { injectButton } from './inject_btn'

const contentScript = defineContentScript({
  matches: ['https://chzzk.naver.com/*'],
  allFrames: true,
  main (_) {
    injectButton() // .catch(console.error)
    // injectFavoriteListComponent()
  }
})

export default contentScript
