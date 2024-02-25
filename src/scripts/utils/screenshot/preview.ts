export function createDraggablePreview (imageDataURL: string, video: HTMLVideoElement): void {
  const rect = video.getBoundingClientRect()

  const preview = document.createElement('img')
  preview.classList.add('chzzk-pip', 'screenshot-preview')

  preview.src = imageDataURL
  preview.style.cssText = `
    position: absolute;
    width: 100%;
    height: auto;
    `

  const wrappedOverlay = wrapWithOverlay(preview)
  wrappedOverlay.style.cssText = `
    position: absolute;
    left: ${rect.left * 1.2}px;
    top: ${rect.top * 1.2}px;
    cursor: move;
    width: ${rect.width * 0.8}px;
    height: auto;
    `
  document.body.appendChild(wrappedOverlay)

  let startPosX = 0
  let startPosY = 0

  wrappedOverlay.addEventListener('mousedown', (e) => {
    const mouseMove = (e: MouseEvent): void => {
      const newPosX = startPosX - e.clientX
      const newPosY = startPosY - e.clientY

      wrappedOverlay.style.left = `${wrappedOverlay.offsetLeft - newPosX}px`
      wrappedOverlay.style.top = `${wrappedOverlay.offsetTop - newPosY}px`

      startPosX = e.clientX
      startPosY = e.clientY
    }

    e.preventDefault()

    startPosX = e.clientX
    startPosY = e.clientY

    document.addEventListener('mousemove', mouseMove)

    document.addEventListener('mouseup', () => {
      document.removeEventListener('mousemove', mouseMove)
    })
  })
}

function wrapWithOverlay (img: HTMLImageElement): HTMLDivElement {
  const overlay = document.createElement('div')
  const cover = document.createElement('div')

  cover.innerHTML = 'Drag to move'

  cover.style.cssText = `
  position: absolute;
  bottom: 0;
  `

  overlay.classList.add('chzzk-screenshot-overlay')
  cover.classList.add('chzzk-screenshot-cover')

  overlay.appendChild(img)
  overlay.appendChild(cover)

  return overlay
}
