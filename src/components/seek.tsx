import React, { useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'

import './seek.css'
import LeftSVG from '../../static/seek_left.svg?react'
import RightSVG from '../../static/seek_right.svg?react'
import { useShortcut } from '../utils/hooks'
import { waitForElement } from '../inject_btn'
import { seekLeft, seekRight } from '../utils/seek/seek'

function SeekLeft ({ state }: { state: boolean }): React.ReactNode {
  return (
    <div className='chzzk-seek-overlay seek-left' style={{ opacity: Number(state) }}>
      <LeftSVG />
      <span>- 5초</span>
    </div>
  )
}

function SeekRight ({ state }: { state: boolean }): React.ReactNode {
  return (
    <div className='chzzk-seek-overlay seek-right' style={{ opacity: Number(state) }}>
      <RightSVG />
      <span>+ 5초</span>
    </div>
  )
}

export function SeekPortal (): React.ReactNode {
  const [target, setTarget] = useState<Element | null>(null)

  useEffect(() => {
    waitForElement('.pzp-pc-command-icon--animate')
      .then(
        (element) => {
          const div = document.createElement('div')
          div.id = 'chzzk-seek-portal'

          element.insertAdjacentElement('afterend', div)
          setTarget(div)
        }).catch(console.error)
  }, [])

  return target === null ? target : ReactDOM.createPortal(<Seek />, target)
}

function Seek (): React.ReactNode {
  const [left, setLeft] = useState(false)
  const [right, setRight] = useState(false)

  const leftTimer = useRef<number | undefined>(undefined)
  const rightTimer = useRef<number | undefined>(undefined)


  useEffect(() => {
    return () => {
      window.clearTimeout(leftTimer.current)
      window.clearTimeout(rightTimer.current)
      setLeft(false)
      setRight(false)
    }
  }, [])

  useShortcut('ArrowLeft', () => {
    const video = document.querySelector('.webplayer-internal-video')
    seekLeft(video as HTMLVideoElement)

    setLeft(true)

    window.clearTimeout(leftTimer.current)
    leftTimer.current = window.setTimeout(() => {
      setLeft(false)
    }, 1000)
  })

  useShortcut('ArrowRight', () => {
    const video = document.querySelector('.webplayer-internal-video')
    seekRight(video as HTMLVideoElement)

    setRight(true)

    window.clearTimeout(rightTimer.current)
    rightTimer.current = window.setTimeout(() => {
      setRight(false)
    }, 1000)
  })

  return (
    <>
      <SeekLeft state={left} />
      <SeekRight state={right} />
    </>
  )
}
