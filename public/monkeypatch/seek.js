async function patchPlayer () {
  const player = await getCorePlayer()
  if (player === null) {
    return
  }

  const config = player.hls.config

  config.liveMaxLatencyDurationCount = Infinity

  config.maxBufferLength = Infinity
  config.maxBufferSize = Infinity
  config.maxBufferLength = Infinity
}

function getMemoizedState (target, stateName, maxTraversal = 100) {
  const getFiberOf = target => {
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
  const x =
    document.querySelector('[class^=live_information_player_header]') ??
    document.querySelector('[class^=od_tooltip_video_tooltip]')

  if (x === null || x === undefined) {
    return null
  }

  const player = getMemoizedState(x, '_corePlayer')
  return player
}

void patchPlayer().catch(console.error)
