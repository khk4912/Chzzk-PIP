import { injectButton, injectShortsDownloadButton } from './inject_btn'

function main () {
  injectButton() // .catch(console.error)
  injectShortsDownloadButton().catch(console.error)
}

main()
