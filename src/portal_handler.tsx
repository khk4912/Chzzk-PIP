import { useEffect, useState } from 'react'

import type { DEFAULT_OPTIONS } from '../types/options'
import { getOption } from '../types/options'
import { waitForElement } from './inject_btn'

import { PIPPortal } from './components/pip_button'
import { RecordPortal } from './components/rec_button'
import { ScreenShotPortal } from './components/screenshot_button'

export function InjectButtons (): React.ReactNode {
  const [target, setTarget] = useState<Element | undefined>(undefined)
  const [options, setOptions] = useState<typeof DEFAULT_OPTIONS>()

  useEffect(() => {
    getOption()
      .then(setOptions)
      .catch(console.error)
  }, [])

  useEffect(() => {
    if (target === undefined) {
      waitForElement('.pzp-pc__bottom-buttons-right')
        .then(setTarget)
        .catch(console.error)
    }
  }, [target])

  return (
    <>
      {((options?.pip) ?? false) && <PIPPortal tg={target} />}
      {((options?.screenshot) ?? false) && <ScreenShotPortal tg={target} />}
      {((options?.rec) ?? false) && <RecordPortal tg={target} />}
    </>
  )
}
