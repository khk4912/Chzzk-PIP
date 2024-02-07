import { isVODPage, openDownloadVODPage } from '../download_vod/download'
import { getOption } from '../options/option_handler'
import { startRecordListener } from '../record/record_events'
import { screenshot } from '../screenshot/screenshot'

const downloadIcon = `
<svg fill="#ffffff"  version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="-249.39 -249.39 987.78 987.78" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M329.2,327.2c-4.5,0-8.1,3.4-8.6,7.9c-3.9,38.6-36.5,68.7-76.2,68.7c-39.6,0-72.2-30.1-76.2-68.7 c-0.5-4.4-4.1-7.9-8.6-7.9h-104c-21.8,0-39.5,17.7-39.5,39.5v82.8c0,21.8,17.7,39.5,39.5,39.5h377.8c21.8,0,39.5-17.7,39.5-39.5 v-82.7c0-21.8-17.7-39.5-39.5-39.5H329.2V327.2z"></path> <path d="M303.5,198.6l-30.9,30.9V28.1C272.6,12.6,260,0,244.5,0l0,0c-15.5,0-28.1,12.6-28.1,28.1v201.4l-30.9-30.9 c-9.5-9.5-24.7-11.9-35.9-4.4c-15.3,10.2-16.8,31.1-4.5,43.4l82.8,82.8c9.2,9.2,24.1,9.2,33.3,0l82.8-82.8 c12.3-12.3,10.8-33.2-4.5-43.4C328.2,186.6,313,189,303.5,198.6z"></path> </g> </g> </g></svg>
`

const pipIcon = `
<svg viewBox="-6.4 -6.4 28.80 28.80" xmlns="http://www.w3.org/2000/svg" fill="#ffffff" class="bi bi-pip" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h13A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 12.5v-9zM1.5 3a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-13z"></path> <path d="M8 8.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1-.5-.5v-3z"></path> </g></svg>
`

const recIcon = `
<svg id="chzzk-rec-icon" fill="#ffffff" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="-19.99 -19.99 79.97 79.97" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path id="XMLID_155_" d="M19.994,0C8.952,0,0,8.952,0,19.995c0,11.043,8.952,19.994,19.994,19.994s19.995-8.952,19.995-19.994 C39.989,8.952,31.037,0,19.994,0z M19.994,27.745c-4.28,0-7.75-3.47-7.75-7.75s3.47-7.75,7.75-7.75s7.75,3.47,7.75,7.75 S24.275,27.745,19.994,27.745z"></path> </g></svg>
`

const screenshotIcon = `
<svg viewBox="-7.2 -7.2 38.40 38.40" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#ffffff" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>screenshot_line</title> <g id="页面-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Design" transform="translate(-624.000000, 0.000000)" fill-rule="nonzero"> <g id="screenshot_line" transform="translate(624.000000, 0.000000)"> <path d="M24,0 L24,24 L0,24 L0,0 L24,0 Z M12.5934901,23.257841 L12.5819402,23.2595131 L12.5108777,23.2950439 L12.4918791,23.2987469 L12.4918791,23.2987469 L12.4767152,23.2950439 L12.4056548,23.2595131 C12.3958229,23.2563662 12.3870493,23.2590235 12.3821421,23.2649074 L12.3780323,23.275831 L12.360941,23.7031097 L12.3658947,23.7234994 L12.3769048,23.7357139 L12.4804777,23.8096931 L12.4953491,23.8136134 L12.4953491,23.8136134 L12.5071152,23.8096931 L12.6106902,23.7357139 L12.6232938,23.7196733 L12.6232938,23.7196733 L12.6266527,23.7031097 L12.609561,23.275831 C12.6075724,23.2657013 12.6010112,23.2592993 12.5934901,23.257841 L12.5934901,23.257841 Z M12.8583906,23.1452862 L12.8445485,23.1473072 L12.6598443,23.2396597 L12.6498822,23.2499052 L12.6498822,23.2499052 L12.6471943,23.2611114 L12.6650943,23.6906389 L12.6699349,23.7034178 L12.6699349,23.7034178 L12.678386,23.7104931 L12.8793402,23.8032389 C12.8914285,23.8068999 12.9022333,23.8029875 12.9078286,23.7952264 L12.9118235,23.7811639 L12.8776777,23.1665331 C12.8752882,23.1545897 12.8674102,23.1470016 12.8583906,23.1452862 L12.8583906,23.1452862 Z M12.1430473,23.1473072 C12.1332178,23.1423925 12.1221763,23.1452606 12.1156365,23.1525954 L12.1099173,23.1665331 L12.0757714,23.7811639 C12.0751323,23.7926639 12.0828099,23.8018602 12.0926481,23.8045676 L12.108256,23.8032389 L12.3092106,23.7104931 L12.3186497,23.7024347 L12.3186497,23.7024347 L12.3225043,23.6906389 L12.340401,23.2611114 L12.337245,23.2485176 L12.337245,23.2485176 L12.3277531,23.2396597 L12.1430473,23.1473072 Z" id="MingCute" fill-rule="nonzero"> </path> <path d="M17,5 C18.0543909,5 18.9181678,5.81587733 18.9945144,6.85073759 L19,7 L19,17 L21,17 C21.5523,17 22,17.4477 22,18 C22,18.51285 21.613973,18.9355092 21.1166239,18.9932725 L21,19 L19,19 L19,21 C19,21.5523 18.5523,22 18,22 C17.48715,22 17.0644908,21.613973 17.0067275,21.1166239 L17,21 L17,7 L9,7 L9,5 L17,5 Z M6,2 C6.51283143,2 6.93550653,2.38604429 6.9932722,2.88337975 L7,3 L7,17 L15,17 L15,19 L7,19 C5.94563773,19 5.08183483,18.18415 5.00548573,17.1492661 L5,17 L5,7 L3,7 C2.44772,7 2,6.55228 2,6 C2,5.48716857 2.38604429,5.06449347 2.88337975,5.0067278 L3,5 L5,5 L5,3 C5,2.44772 5.44772,2 6,2 Z" id="形状" fill="#ffffff"> </path> </g> </g> </g> </g></svg>
`

export function addButton (): void {
  void (async () => {
    const btn = await waitForElement('.pzp-pc__bottom-buttons-right')

    if (btn.classList.contains('chzzk-pip-injected')) {
      return
    }

    btn.classList.add('chzzk-pip-injected')

    if (btn === null) {
      return
    }

    const option = await getOption()
    const { pip, rec, screenshot } = option

    if (isVODPage()) {
      const vodDownloadButton = createVODDownloadButton()
      btn.insertBefore(vodDownloadButton, btn.firstChild)
    }

    if (pip) {
      const pipButton = createPIPButton()
      btn.insertBefore(pipButton, btn.firstChild)
    }

    if (screenshot) {
      const screenshotButton = createScreenshotButton()
      btn.insertBefore(screenshotButton, btn.firstChild)
      document.addEventListener('keydown', screenshotShortcut)
    }

    if (rec) {
      const recordButton = createRecordButton()
      btn.insertBefore(recordButton, btn.firstChild)
      document.addEventListener('keydown', recordShortcut)
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

function createVODDownloadButton (): HTMLButtonElement {
  const vodDownloadButton = document.createElement('button')
  vodDownloadButton.classList.add('pzp-button', 'pzp-pc-setting-button', 'pzp-pc__setting-button', 'pzp-pc-ui-button')
  vodDownloadButton.addEventListener('click', () => {
    void openDownloadVODPage()
  })

  const toolTip = document.createElement('span')
  toolTip.classList.add('pzp-pc-ui-button__tooltip', 'pzp-pc-ui-button__tooltip--top')
  toolTip.innerText = '다운로드'

  const icon = document.createElement('span')
  icon.classList.add('pzp-ui-icon', 'pzp-pc-setting-button__icon')
  icon.innerHTML = downloadIcon

  vodDownloadButton.appendChild(toolTip)
  vodDownloadButton.appendChild(icon)
  return vodDownloadButton
}

function createPIPButton (): HTMLButtonElement {
  const pipButton = document.createElement('button')
  pipButton.classList.add('pzp-button', 'pzp-pc-setting-button', 'pzp-pc__setting-button', 'pzp-pc-ui-button')
  pipButton.addEventListener('click', () => {
    void makeVideoPIP()
    // void windowPIP()
  })

  const toolTip = document.createElement('span')
  toolTip.classList.add('pzp-pc-ui-button__tooltip', 'pzp-pc-ui-button__tooltip--top')
  toolTip.innerText = 'PIP'

  const icon = document.createElement('span')
  icon.classList.add('pzp-ui-icon', 'pzp-pc-setting-button__icon')
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
  recordIcon.classList.add('pzp-ui-icon', 'pzp-pc-setting-button__icon')
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
  if (document.pictureInPictureElement != null) {
    await document.exitPictureInPicture()
  } else {
    await video.requestPictureInPicture()
  }
}

function recordShortcut (e: KeyboardEvent): void {
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

function screenshotShortcut (e: KeyboardEvent): void {
  if (e.key === 's' || e.key === 'S' || e.key === 'ㄴ') {
    const activeElement = document.activeElement
    if (activeElement instanceof HTMLInputElement ||
      activeElement instanceof HTMLTextAreaElement ||
      activeElement instanceof HTMLPreElement) {
      return
    }

    screenshot()
  }
}

function createScreenshotButton (): HTMLButtonElement {
  const screenshotButton = document.createElement('button')
  screenshotButton.classList.add('pzp-button', 'pzp-pc-setting-button', 'pzp-pc__setting-button', 'pzp-pc-ui-button')
  screenshotButton.addEventListener('click', () => {
    screenshot()
  })

  const toolTip = document.createElement('span')
  toolTip.classList.add('pzp-pc-ui-button__tooltip', 'pzp-pc-ui-button__tooltip--top')
  toolTip.innerText = '스크린샷 (s)'

  const icon = document.createElement('span')
  icon.classList.add('pzp-ui-icon', 'pzp-pc-setting-button__icon')
  icon.innerHTML = screenshotIcon

  screenshotButton.appendChild(toolTip)
  screenshotButton.appendChild(icon)
  return screenshotButton
}
