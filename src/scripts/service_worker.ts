import { setOption } from './utils/options/option_handler'

chrome.runtime.onInstalled.addListener((details) => {
  const previousVersion = details.previousVersion

  if (previousVersion === undefined) {
    return
  }

  if (previousVersion === '0.0.26') {
    void setOption('pip', false)
  }
})
