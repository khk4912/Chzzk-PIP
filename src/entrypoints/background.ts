import type { DownloadMessage, MessageType } from '../types/message'

export default defineBackground(() => {
// Download message listener
  chrome.runtime.onMessage.addListener((request: MessageType) => {
    if (request.type === 'download') {
      const msg = request as DownloadMessage

      chrome.downloads.download({
        url: msg.data.url,
        filename: msg.data.fileName
      })
        .catch(console.error)
    }
  })
})
