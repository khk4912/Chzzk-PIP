/**
 * @file useFlash.ts
 * @description 일시적인 UI 상태 (예: "플래시" 메시지)를 관리하기 위한 React Hook입니다.
 */

import { useState, useEffect, useRef, useCallback } from 'react'

/**
 * `useFlash` 훅의 반환 타입입니다.
 * 첫 번째 요소는 현재 UI 요소의 표시 여부 (boolean)이며,
 * 두 번째 요소는 플래시를 트리거하는 함수입니다.
 */
type UseFlashReturn = [boolean, () => void];

/**
 * 일시적으로 UI 요소를 표시했다가 지정된 시간 후에 자동으로 숨기는 기능을 제공하는 커스텀 Hook입니다.
 *
 * 이 Hook은 boolean 상태 (`isVisible`)와 이 상태를 제어하는 함수 (`triggerFlash`)를 반환합니다.
 * `triggerFlash` 함수가 호출되면 `isVisible` 상태는 true가 되고, 지정된 `duration` 밀리초 후에
 * 자동으로 false로 돌아갑니다. `triggerFlash`가 연속적으로 호출될 경우, 이전 타이머는 초기화되고
 * 새로운 타이머가 설정됩니다.
 *
 * @param duration - UI 요소가 표시될 시간 (밀리초 단위)입니다.
 * @returns `[isVisible: boolean, triggerFlash: () => void]` 튜플.
 *          `isVisible`은 현재 UI 요소의 표시 상태이며,
 *          `triggerFlash`는 UI 요소의 표시를 시작하는 함수입니다.
 */
export function useFlash (duration: number): UseFlashReturn {
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  /**
   * UI 요소의 플래시를 트리거합니다.
   * 호출 시, UI 요소는 true로 설정되고, 지정된 `duration` 후에 false로 자동 변경됩니다.
   * 연속 호출 시 이전 타이머는 취소됩니다.
   */
  const triggerFlash = useCallback(() => {
    setIsVisible(true)

    // 만약 이미 실행 중인 타이머가 있다면 초기화합니다.
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    // 새로운 타이머를 설정하여 duration 후에 isVisible 상태를 false로 변경합니다.
    timerRef.current = setTimeout(() => {
      setIsVisible(false)
      timerRef.current = null; // 타이머 만료 후 ref 정리
    }, duration)
  }, [duration]) // duration이 변경될 경우 콜백을 재생성합니다.

  // 컴포넌트 언마운트 시 타이머를 정리합니다.
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, []) // 이 effect는 마운트 시 한 번만 실행되어야 합니다.

  return [isVisible, triggerFlash]
}
