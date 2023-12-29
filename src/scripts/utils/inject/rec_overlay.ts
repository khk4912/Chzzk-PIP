export function injectOverlay (): void {
  const target = document.querySelector('[class^=live_information_player_area]')

  if (target === null) {
    return
  }

  const overlay = document.createElement('div')
  overlay.style.display = 'flex'
  overlay.style.alignItems = 'center'
  overlay.style.justifyContent = 'center'
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)'
  overlay.style.padding = '1%'
  overlay.style.borderRadius = '10%'

  const recIcon = document.createElement('div')
  recIcon.style.width = '0.3vw'
  recIcon.style.height = '0.3vw'
  recIcon.style.marginRight = '0.3vw'
  recIcon.style.backgroundColor = 'red'
  recIcon.style.borderRadius = '50%'

  const timeText = document.createElement('span')
  timeText.id = 'timeText'
  timeText.innerText = '00:00'

  overlay.appendChild(recIcon)
  overlay.appendChild(timeText)
  target.insertBefore(overlay, target.firstChild)
}

export function updateOverlay (time: number): void {
  const timeText = document.querySelector('#timeText')
  if (timeText === null) {
    return
  }

  timeText.textContent = senondsToTime(time)
}

export const removeOverlay = (): void => {
  const overlay = document.querySelector('[class^=live_information_player_area] > div')
  if (overlay === null) {
    return
  }

  overlay.remove()
}

function senondsToTime (seconds: number): string {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, '0')
  const remainSeconds = (seconds % 60).toString().padStart(2, '0')

  return `${minutes}:${remainSeconds}`
}
