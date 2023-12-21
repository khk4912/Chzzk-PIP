async function main (): Promise<void> {
  const { recorderBlob } = await chrome.storage.local.get('recorderBlob')

  const video = document.getElementById('vid') as HTMLVideoElement
  video.src = recorderBlob

  const downloadButton = document.getElementById('downloadBtn') as HTMLButtonElement

  downloadButton.addEventListener('click', () => {
    const a = document.createElement('a')
    a.href = recorderBlob
    a.download = 'video.webm'
    a.click()
  })

  await chrome.storage.local.set({ recorderBlob: [] })
}

void main()
