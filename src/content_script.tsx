import { injectButton } from './inject_btn'

async function main (): Promise<void> {
  void injectButton()

  if (window.navigation === undefined) {
    // TODO: Add classic way for unsupported browsers
    return
  }

  window.navigation.addEventListener('navigate', () => { void injectButton() })
}

void main().catch(console.error)
