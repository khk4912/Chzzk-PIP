/**
 * @file useStopwatch.ts
 * @description 간단한 스톱워치 기능을 구현하는 커스텀 React Hook입니다.
 * 초기화된 순간부터 경과 시간을 초 단위로 계산합니다.
 */

/**
 * 스톱워치 타이머를 구현하는 커스텀 Hook입니다.
 *
 * 이 Hook은 매초 카운터를 증가시키는 인터벌 타이머를 관리하여,
 * 경과 시간을 초 단위로 나타냅니다. 타이머는 Hook이 컴포넌트 내에서 초기화될 때 시작되며,
 * 컴포넌트가 언마운트될 때 중지됩니다.
 *
 * @returns {number} 스톱워치가 시작된 후 경과된 총 시간 (초 단위).
 */
export function useStopwatch (): number {
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    // Set up an interval to increment the seconds counter every 1000ms (1 second).
    const intervalId = setInterval(() => {
      setSeconds(prevSeconds => prevSeconds + 1)
    }, 1000)

    // Cleanup function: This will be called when the component unmounts.
    // It clears the interval to prevent memory leaks and stop the timer.
    return () => {
      clearInterval(intervalId)
    }
  }, []) // Empty dependency array means this effect runs once on mount and cleans up on unmount.

  return seconds
}
