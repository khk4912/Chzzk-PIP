import { injectButton, injectShortsDownloadButton } from './inject_btn'

async function main (): Promise<void> {
  void injectButton()
  void injectShortsDownloadButton()
}

void main().catch(console.error)
