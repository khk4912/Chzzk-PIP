/**
 * @file string_utils.ts
 * @description 문자열 조작 유틸리티 함수, 주로 파일명 안전 처리 및 날짜 포맷팅에 중점을 둡니다.
 */

/**
 * Date 객체를 YYYYMMDDHHMMSS 형식의 문자열로 변환합니다.
 * @param date - 포맷할 Date 객체입니다.
 * @returns YYYYMMDDHHMMSS 형식의 날짜 문자열 표현입니다.
 */
export const yyyymmddhhmmss = (date: Date): string => {
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  const hh = String(date.getHours()).padStart(2, '0')
  const mi = String(date.getMinutes()).padStart(2, '0')
  const ss = String(date.getSeconds()).padStart(2, '0')

  return `${yyyy}${mm}${dd}${hh}${mi}${ss}`
}

/**
 * 일반적인 운영 체제에서 파일명으로 허용되지 않는 문자들을 제거하거나 대체하여
 * 파일명으로 사용될 수 있도록 문자열을 안전하게 처리합니다.
 *
 * 다음 문자들을 밑줄(_)로 대체합니다: / \ ? % * : | " < >
 * 또한 ASCII 제어 문자(0x00-0x1F) 및 DEL(0x7F) 문자를 제거합니다.
 *
 * @param filename - 제안된 파일명입니다.
 * @returns 안전하게 처리된 파일명 문자열입니다.
 */
export const sanitizeFileName = (filename: string): string => {
  // biome-ignore lint/suspicious/noControlCharactersInRegex: <explanation>
  return filename.replace(/[/\\?%*:|"<>\x00-\x1f\x7f]/g, '_')
}
