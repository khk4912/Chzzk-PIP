export async function injectWithTimeout (
  child: HTMLElement,
  timeout: number
): Promise<void> {
  const inserted = document.querySelectorAll('.chzzk-seek-overlay')
  inserted.forEach((e) => { e.remove() })

  const target = document.querySelector('.pzp-pc-command-icon--animate')

  child.style.opacity = '1'
  if (target === null) {
    return
  }

  target.insertAdjacentElement('afterend', child)
  await new Promise(resolve => setTimeout(resolve, timeout))

  child.style.opacity = '0'
  await new Promise(resolve => setTimeout(resolve, 500))
}

const overlayCSS = `
position: absolute;
height: 30%;
aspect-ratio: 1 / 1;
background-color: rgba(0, 0, 0, 0.6);
top: 35%;
transition: opacity 0.5s ease-in-out 0s;
display: grid;
place-items: center;
justify-items: space-evenly;
opacity: 1;
padding: 1%;
`

export const seekOverlayLeft = document.createElement('div')
seekOverlayLeft.classList.add('chzzk-seek-overlay')
seekOverlayLeft.style.cssText = `
${overlayCSS}
left: 10%;
`
seekOverlayLeft.innerHTML = `
<svg fill="#ffffff" width="40%" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 490.00 490.00" xml:space="preserve" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <polygon points="332.668,490 82.631,244.996 332.668,0 407.369,76.493 235.402,244.996 407.369,413.507 "></polygon> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> </g> </g></svg>
<span>5초</span>
`

export const seekOverlayRight = document.createElement('div')
seekOverlayRight.classList.add('chzzk-seek-overlay')
seekOverlayRight.style.cssText = `
${overlayCSS}
right: 10%;
`
seekOverlayRight.innerHTML = `
<svg fill="#ffffff" width="40%" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 490.00 490.00" xml:space="preserve" stroke="#ffffff" transform="matrix(-1, 0, 0, 1, 0, 0)"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <polygon points="332.668,490 82.631,244.996 332.668,0 407.369,76.493 235.402,244.996 407.369,413.507 "></polygon> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> </g> </g></svg>
<span>5초</span>
`
