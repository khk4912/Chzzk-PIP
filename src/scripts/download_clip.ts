void (async () => {
  const { clipDownloadURL, title } = await chrome.storage.local.get(['clipDownloadURL', 'title']) as { clipDownloadURL: string, title: string }

  chrome.downloads.download({
    url: clipDownloadURL,
    filename: `${title.replace(/[/\\?%*:|"<>]/g, '_')}.mp4`
  }, (downloadID) => {
    console.log(`Download started with ID: ${downloadID}`)
    window.close()
  })
})()
