import { useEffect } from 'react'

export function useShortcut (key: string | string[], callback: () => void): void {
  useEffect(() => {
    const listener = (event: KeyboardEvent): void => {
      if (event.target instanceof HTMLInputElement ||
          event.target instanceof HTMLTextAreaElement) {
        return
      }

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
