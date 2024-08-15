import { injectButton, injectShortsDownloadButton } from './inject_btn'
import { isClipsPage } from './utils/download/download'

async function main (): Promise<void> {
  void injectButton()

  // if (isClipsPage()) {
  //   void injectShortsDownloadButton()
  // }
}

void main().catch(console.error)
