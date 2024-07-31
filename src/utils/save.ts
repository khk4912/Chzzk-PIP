export function saveScreenshot (dataURL: string, title: string): void {
  const a = document.createElement('a')

  a.href = dataURL
  a.download = `${title}.png`
  a.click()
}
