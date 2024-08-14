import ReactDOM from 'react-dom'

import { useEffect, useState } from 'react'
import DownloadIcon from '../../static/download.svg?react'
import { waitForElement } from '../inject_btn'
import { downloadClip } from '../utils/download/clip'

export function ClipsDownloadButton (): React.ReactNode {
  const [seedClipUID, setSeedClipUID] = useState<string | undefined>(undefined)

  useEffect(() => {
    const url = new URL(window.location.href)

    const json = JSON.parse(url.searchParams.get('recId') ?? '{}')
    setSeedClipUID(json?.seedClipUID as string | undefined)
  }, [])

  const clickHandler = (): void => {
    if (seedClipUID === undefined) {
      return
    }

    downloadClip(seedClipUID).catch(console.error)
  }

  return <button onClick={clickHandler} type='button' className='si_btn' aria-expanded='false'><span className=''><DownloadIcon /></span> <span className='si_text'>다운로드</span></button>
}
function ClipsDownloadButtonPortal (): React.ReactNode {
  const [target, setTarget] = useState<Element | undefined>(undefined)

  // https://m.naver.com/shorts/?mediaId=D82DE1FBC4447268C20B6E4DB4BBB804E374&serviceType=CHZZK&mediaType=&recType=CHZZK&recId=%7B%22seedClipUID%22%3A%22jd2aKJFa80%22%2C%22fromType%22%3A%22GLOBAL%22%2C%22listType%22%3A%22RECOMMEND%22%7D&blogId=&docNo=&adAllowed=Y&feedBlock=&enableReverse=false&notInterestedMediaIds=&notInterestedChannelIds=&panelType=sdk_chzzk&entryPoint=&stmsId=&clickNsc=chzzk_url_clip&clickArea=clip_item&adUnitId=chzzk_shortformviewer_web&viewerInfo=chzzk_shortformviewer_web&adCtrl=&theme=light&viewMode=mobile&sdkTargetId=PLAYER-SDK-0-44&env=&embed=tru
  // Get Seed Clip id

  useEffect(() => {
    waitForElement('iframe[class^="clip_viewer_section"]')
      .then((iframe) => {
        const doc = (iframe as HTMLIFrameElement).contentDocument
        if (doc === null) {
          return
        }

        const div = doc.createElement('div')
        div.id = 'chzzk-pip-clips-download-button'

        const tg = doc.body.querySelector('.si_tool_box')
        tg?.insertBefore(div, tg.lastChild)

        setTarget(div)
      })
      .catch(console.error)
  }, [])

  return (target !== undefined) ? ReactDOM.createPortal(<ClipsDownloadButton />, target) : null
}
