const pipIcon = `
<svg viewBox="-6.4 -6.4 28.80 28.80" xmlns="http://www.w3.org/2000/svg" fill="#ffffff" class="bi bi-pip" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h13A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 12.5v-9zM1.5 3a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-13z"></path> <path d="M8 8.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1-.5-.5v-3z"></path> </g></svg>
`
export function addButton (btn: HTMLDivElement): void {
  const pipButton = document.createElement('button')
  pipButton.classList.add('pzp-button', 'pzp-pc-fullscreen-button', 'pzp-pc__fullscreen-button', 'pzp-pc-ui-button')
  pipButton.addEventListener('click', () => {
    void makeVideoPIP()
  })

  const toolTip = document.createElement('span')
  toolTip.classList.add('pzp-pc-ui-button__tooltip', 'pzp-pc-ui-button__tooltip--top')
  toolTip.innerText = 'PIP'

  const icon = document.createElement('span')
  icon.classList.add('pzp-ui-icon', 'pzp-pc-fullscreen-button__icon')
  icon.innerHTML = pipIcon

  pipButton.appendChild(toolTip)
  pipButton.appendChild(icon)

  btn.insertBefore(pipButton, btn.firstChild)
}

export async function waitForElement (selector: string): Promise<HTMLElement> {
  return await new Promise((resolve, reject) => {
    const interval = setInterval(() => {
      const element = document.querySelector(selector)
      if (element !== null) {
        clearInterval(interval)
        resolve(element as HTMLElement)
      }
    }, 100)
  })
}

async function makeVideoPIP (): Promise<void> {
  const video = document.querySelector('video')

  if (video === null) {
    return
  }

  video.disablePictureInPicture = false
  if (video !== null) {
    await video.requestPictureInPicture()
  }
}
