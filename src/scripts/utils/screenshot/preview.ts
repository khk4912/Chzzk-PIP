export function createDraggablePreview (imageDataURL: string, video: HTMLVideoElement): void {
  const rect = video.getBoundingClientRect()

  const preview = document.createElement('img')
  preview.classList.add('chzzk-pip', 'screenshot-preview')
  preview.src = imageDataURL

  preview.style.cssText = `
    position: absolute;
    left: ${rect.left * 1.2}px;
    top: ${rect.top * 1.2}px;
    resize: both;
    cursor: move;
    width: ${rect.width * 0.8}px;
    height: auto;
    `

  document.body.appendChild(preview)

  let startPosX = 0
  let startPosY = 0

  preview.addEventListener('mousedown', (e) => {
    const mouseMove = (e: MouseEvent): void => {
      const newPosX = startPosX - e.clientX
      const newPosY = startPosY - e.clientY

      preview.style.left = `${preview.offsetLeft - newPosX}px`
      preview.style.top = `${preview.offsetTop - newPosY}px`

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
