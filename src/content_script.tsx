import { injectButton } from './inject_btn'

async function main (): Promise<void> {
  void injectButton()
}

void main().catch(console.error)
