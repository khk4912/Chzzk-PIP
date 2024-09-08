import { useEffect } from 'react'

/**
 * 키보드 키를 감지하여 callback을 실행하는 hook입니다.
 *
 * @param key 감지할 키 / 키들의 배열
 * @param callback 키 입력 시 실행할 콜백 함수
 */
export function useShortcut (key: string | string[], callback: () => void): void {
  useEffect(() => {
    const listener = (event: KeyboardEvent): void => {
      const activeElement = document.activeElement

      // 입력 요소가 검색창, 채팅창 등의 입력 요소일 경우 무시
      if (activeElement instanceof HTMLInputElement ||
        activeElement instanceof HTMLTextAreaElement ||
         activeElement instanceof HTMLPreElement) {
        return
      }

      // 또는 cmd, opt 등 다른 단축키에 자주 사용되는 키와 함께 눌렸을 경우 무시
      if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) {
        return
      }

      if (typeof key === 'string' && event.key === key) {
        callback()
      }

      if (Array.isArray(key) && key.includes(event.key)) {
        callback()
      }
    }

    document.addEventListener('keydown', listener)

    return () => {
      document.removeEventListener('keydown', listener)
    }
  }, [key, callback])
}
