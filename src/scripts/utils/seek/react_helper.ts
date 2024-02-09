export function getMemoizedState (
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
      if (stateName in memoizedState.memoizedState) {
        return memoizedState.memoizedState[stateName]
      }

      memoizedState = memoizedState.next
    }

    fiber = fiber.return
  }

  return undefined
}

export function getCorePlayer (): any {
  const x = document.querySelector('[class^=live_information_player_header]')

  if (x === null) {
    return
  }

  const player = getMemoizedState(x, '_corePlayer')
  return player
}
