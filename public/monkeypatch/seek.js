/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

async function patchPlayer () {
  const player = await getCorePlayer()

  if (player === null) {
    return
  }

  const config = player.player._mediaController._hls.config
  console.log('[Chzzk-PIP] Monekypatching HLS Config', config)

  config.liveMaxLatencyDurationCount = Infinity

  config.backBufferLength = Infinity
  config.maxBufferLength = Infinity
  config.maxBufferSize = Infinity
  config.maxBufferLength = Infinity
}

function getMemoizedState (target, stateName, maxTraversal = 100) {
  const getFiberOf = (target) => {
    return Object.entries(target).find(([key]) =>
      key.startsWith('__reactFiber$')
    )?.[1]
  }

  let fiber = getFiberOf(target)

  for (let i = 0; i < maxTraversal; i++) {
    let memoizedState = fiber.memoizedState

    while (memoizedState !== null) {
      if (
        typeof memoizedState.memoizedState === 'object' &&
        stateName in memoizedState.memoizedState
      ) {
        return memoizedState.memoizedState[stateName]
      }

      memoizedState = memoizedState.next
    }

    fiber = fiber.return
  }

  return undefined
}

async function getCorePlayer () {
  const x = await waitForElement('#live_player_layout')

  if (x === null || x === undefined) {
    return null
  }

  const player = getMemoizedState(x, '_corePlayer')
  return player
}

async function waitForElement (selector, threshold = 3000) {
  let cnt = 0

  return await new Promise((resolve, reject) => {
    const interval = setInterval(() => {
      const element = document.querySelector(selector)
      if (element !== null) {
        clearInterval(interval)
        resolve(element)
      }

      if (cnt >= threshold) {
        clearInterval(interval)
        reject(new Error('Cannot find element within threshold time'))
      }

      cnt += 100
    }, 100)
  })
}

patchPlayer().catch(console.error)
