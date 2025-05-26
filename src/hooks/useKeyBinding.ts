/**
 * @file useKeyBinding.ts
 * @description 특정 기능에 대한 단축키 설정 값을 가져오는 React Hook입니다.
 */

import { useState, useEffect } from 'react'
import { getKeyBindings, type KeyBindings, DEFAULT_KEYBINDINGS } from '@/types/options'

/**
 * `useKeyBinding` 훅의 반환 값 타입입니다.
 */
interface UseKeyBindingResult {
  /**
   * 조회된 단축키 문자열입니다. 로딩 중이거나 오류 발생 시 기본값이 될 수 있습니다.
   */
  key: string;
  /**
   * 단축키를 불러오는 중인지 여부를 나타냅니다.
   */
  isLoading: boolean;
}

/**
 * 지정된 `optionID`에 해당하는 단축키 값을 가져오는 커스텀 Hook입니다.
 *
 * 이 Hook은 `getKeyBindings` 함수를 사용하여 전체 단축키 설정을 비동기적으로 불러온 후,
 * 요청된 `optionID`에 해당하는 특정 단축키 값을 상태로 관리합니다.
 * 단축키를 불러오는 동안 `isLoading` 상태를 true로 설정합니다.
 *
 * @param optionID - 가져올 단축키의 ID입니다. (`KeyBindings` 타입의 키 값)
 * @returns `{ key: string, isLoading: boolean }` 형태의 객체.
 *          `key`는 해당 `optionID`의 단축키 값이며, `isLoading`은 로딩 상태입니다.
 */
export function useKeyBinding (optionID: keyof KeyBindings): UseKeyBindingResult {
  // optionID에 해당하는 기본 단축키 값으로 초기화합니다.
  const [key, setKey] = useState<string>(DEFAULT_KEYBINDINGS[optionID] || '')
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    let isMounted = true // 컴포넌트 마운트 상태 추적
    setIsLoading(true)

    getKeyBindings()
      .then((allBindings) => {
        if (isMounted) {
          setKey(allBindings[optionID] || DEFAULT_KEYBINDINGS[optionID] || '')
          setIsLoading(false)
        }
      })
      .catch((error) => {
        console.error(`Error fetching key binding for ${optionID}:`, error)
        if (isMounted) {
          // 오류 발생 시 기본값으로 설정하거나 특정 오류 값으로 설정할 수 있습니다.
          setKey(DEFAULT_KEYBINDINGS[optionID] || '')
          setIsLoading(false)
        }
      })

    return () => {
      isMounted = false // 컴포넌트 언마운트 시 상태 업데이트 방지
    }
  }, [optionID]) // optionID가 변경되면 효과를 다시 실행합니다.

  return { key, isLoading }
}
