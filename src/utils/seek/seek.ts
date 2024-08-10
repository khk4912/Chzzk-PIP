// https://
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

function patchPlayer (): void {
  const player = getCorePlayer()
  if (player === null) {
    return
  }

  const config = player.hls.config

  config.liveMaxLatencyDurationCount = Infinity

  config.maxBufferLength = Infinity
  config.maxBufferSize = Infinity
  config.maxBufferLength = Infinity

  console.log('Patched player')
}

function getMemoizedState (
  target: Element,
  stateName: string,
  maxTraversal = 100
): any {
  const getFiberOf = (target: Element): any => {
    return Object.entries(target)
      .find(([key]) => key.startsWith('__reactFiber$'))?.[1]
  }

  let fiber = getFiberOf(target)

  for (let i = 0; i < maxTraversal; i++) {
    let memoizedState = fiber.memoizedState

    while (memoizedState !== null) {
      if (
        typeof memoizedState.memoizedState === 'object' &&
        stateName in memoizedState.memoizedState) {
        return memoizedState.memoizedState[stateName]
      }

      memoizedState = memoizedState.next
    }

    fiber = fiber.return
  }

  return undefined
}

function getCorePlayer (): any {
  const x = document.querySelector('[class^=live_information_player_header]') ??
            document.querySelector('[class^=od_tooltip_video_tooltip]')

  if (x === null || x === undefined) {
    return null
  }

  const player = getMemoizedState(x, '_corePlayer')
  console.log('')
  return player
}

patchPlayer()
