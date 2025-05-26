/**
 * @file usePageNavigate.ts
 * @description 페이지 탐색(navigation) 이벤트를 감지하고 콜백을 실행하는 React Hook입니다.
 * 브라우저별 탐색 이벤트 처리 방식의 차이를 추상화합니다.
 */

import { useEffect, useRef } from 'react'

/**
 * 페이지 탐색 이벤트를 감지하여 제공된 콜백 함수를 실행하는 커스텀 Hook입니다.
 *
 * 이 Hook은 표준 `window.navigation` API를 우선적으로 사용합니다. 해당 API를 사용할 수 없는 경우
 * (예: Firefox), `MutationObserver`를 사용하여 URL 변경을 감지하는 대체 방식을 사용합니다.
 *
 * @param onNavigate - 페이지 탐색이 감지되었을 때 실행할 콜백 함수입니다.
 */
export function usePageNavigate (onNavigate: () => void): void {
  const currentHrefRef = useRef<string>(window.location.href)

  useEffect(() => {
    // onNavigate 콜백이 변경될 경우를 대비하여 ref에 저장하여 항상 최신 콜백을 사용하도록 합니다.
    const onNavigateRef = useRef(onNavigate)
    onNavigateRef.current = onNavigate

    // window.navigation API 사용 (표준 방식)
    if (window.navigation) {
      const handleNavigate = () => {
        onNavigateRef.current()
      }

      window.navigation.addEventListener('navigate', handleNavigate)

      return () => {
        window.navigation.removeEventListener('navigate', handleNavigate)
      }
    } else {
      // MutationObserver 사용 (Firefox 등 대체 방식)
      // 현재 URL을 ref에 저장하여 변경 감지에 사용합니다.
      currentHrefRef.current = window.location.href

      const observer = new MutationObserver(() => {
        if (currentHrefRef.current !== window.location.href) {
          currentHrefRef.current = window.location.href
          onNavigateRef.current()
        }
      })

      // document.body 대신 document.documentElement를 관찰하여 좀 더 광범위한 변경을 감지할 수 있습니다.
      // SPA 네비게이션은 보통 body 내부의 변화뿐만 아니라, head의 title 변경 등도 포함할 수 있기 때문입니다.
      observer.observe(document.documentElement, {
        childList: true,
        subtree: true
      })

      return () => {
        observer.disconnect()
      }
    }
  }, []) // 이 effect는 마운트 시 한 번만 실행되어야 합니다. onNavigate 콜백은 ref를 통해 최신 상태를 유지합니다.
}
