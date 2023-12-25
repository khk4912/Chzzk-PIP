import type { Option } from '../types/option'
import { startRecordListener } from './record_events'

const pipIcon = `
<svg viewBox="-6.4 -6.4 28.80 28.80" xmlns="http://www.w3.org/2000/svg" fill="#ffffff" class="bi bi-pip" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h13A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 12.5v-9zM1.5 3a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-13z"></path> <path d="M8 8.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1-.5-.5v-3z"></path> </g></svg>
`

const recIcon = `
<svg id="chzzk-rec-icon" fill="#ffffff" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="-19.99 -19.99 79.97 79.97" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path id="XMLID_155_" d="M19.994,0C8.952,0,0,8.952,0,19.995c0,11.043,8.952,19.994,19.994,19.994s19.995-8.952,19.995-19.994 C39.989,8.952,31.037,0,19.994,0z M19.994,27.745c-4.28,0-7.75-3.47-7.75-7.75s3.47-7.75,7.75-7.75s7.75,3.47,7.75,7.75 S24.275,27.745,19.994,27.745z"></path> </g></svg>
`

export function addButton (btn: HTMLDivElement): void {
  void (async () => {
    const option: Option = (await chrome.storage.local.get('option'))?.option ?? {}

    const [pip, rec] = [option?.pip ?? true, option?.rec ?? true]

    if (pip) {
      const pipButton = createPIPButton()
      btn.insertBefore(pipButton, btn.firstChild)
    }

    if (rec) {
      const recordButton = createRecordButton()
      btn.insertBefore(recordButton, btn.firstChild)
    }
  })()
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

function createPIPButton (): HTMLButtonElement {
  const pipButton = document.createElement('button')
  pipButton.classList.add('pzp-button', 'pzp-pc-setting-button', 'pzp-pc__setting-button', 'pzp-pc-ui-button')
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
  return pipButton
}

function createRecordButton (): HTMLButtonElement {
  const recordButton = document.createElement('button')
  recordButton.classList.add('pzp-button', 'pzp-pc-setting-button', 'pzp-pc__setting-button', 'pzp-pc-ui-button', 'chzzk-record-button')
  recordButton.addEventListener('click', startRecordListener, { once: true })

  const recordToolTip = document.createElement('span')
  recordToolTip.classList.add('pzp-pc-ui-button__tooltip', 'pzp-pc-ui-button__tooltip--top')
  recordToolTip.innerText = '녹화 (r)'

  const recordIcon = document.createElement('span')
  recordIcon.classList.add('pzp-ui-icon', 'pzp-pc-fullscreen-button__icon')
  recordIcon.innerHTML = recIcon

  recordButton.appendChild(recordToolTip)
  recordButton.appendChild(recordIcon)

  return recordButton
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

export function recordShortcut (e: KeyboardEvent): void {
  if (e.key === 'r' || e.key === 'R' || e.key === 'ㄱ') {
    const activeElement = document.activeElement
    if (activeElement instanceof HTMLInputElement ||
      activeElement instanceof HTMLTextAreaElement ||
      activeElement instanceof HTMLPreElement) {
      return
    }

    const recordButton = document.querySelector('.chzzk-record-button')

    if (recordButton instanceof HTMLButtonElement) {
      recordButton.click()
    }
  }
}
