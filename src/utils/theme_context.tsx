import { createContext, useContext, useEffect, useState } from 'react'

const getTheme = (): 'dark' | 'light' => {
  const isDark = document.documentElement.classList.contains('theme_dark') ?? true
  return isDark ? 'dark' : 'light'
}

const ThemeContext = createContext<'dark' | 'light'>('dark')

export function ThemeContextProvider ({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setTheme(getTheme())
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    return () => { observer.disconnect() }
  }, [])

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  )
}
export function useThemeContext (): 'dark' | 'light' {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeContextProvider')
  }

  return context
}
