import type { DownloadMessage, MessageType } from '../types/message'

chrome.runtime.onMessage.addListener((request: MessageType) => {
  if (request.type === 'download') {
    const msg = request as DownloadMessage

    void chrome.downloads.download({
      url: msg.data.url,
      filename: msg.data.fileName
    })
  }
})
