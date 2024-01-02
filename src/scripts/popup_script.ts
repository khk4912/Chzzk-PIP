import { getOption, setOption } from './utils/options/option_handler'

const [pipSwitch, recSwitch, screenshotSwitch, fastSaveSwitch, seekSwitch] =
  document.querySelectorAll('input[type="checkbox"]')

const isInputElement = (element: Element): element is HTMLInputElement => {
  return element instanceof HTMLInputElement
}

function init (): void {
  if (
    !(
      isInputElement(pipSwitch) && isInputElement(recSwitch) &&
      isInputElement(screenshotSwitch) && isInputElement(fastSaveSwitch) &&
      isInputElement(seekSwitch)
    )
  ) {
    return
  }
  void (async () => {
    const option = await getOption()

    pipSwitch.checked = option.pip
    recSwitch.checked = option.rec
    screenshotSwitch.checked = option.screenshot
    fastSaveSwitch.checked = option.fastRec
    seekSwitch.checked = option.seek
  })()
}

async function handleChange (e: Event): Promise<void> {
  if (!(e.target instanceof HTMLInputElement)) {
    return
  }

  switch (e.target) {
    case pipSwitch:
      await setOption('pip', e.target.checked)
      break
    case recSwitch:
      await setOption('rec', e.target.checked)
      break
    case fastSaveSwitch:
      await setOption('fastRec', e.target.checked)
      break
    case seekSwitch:
      await setOption('seek', e.target.checked)
      break
    case screenshotSwitch:
      await setOption('screenshot', e.target.checked)
      break
  }
}

init()
document.addEventListener('change', (e) => {
  void (async () => {
    await handleChange(e)
  })()
})
