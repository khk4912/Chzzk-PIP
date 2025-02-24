const StrokeColor = {
  DARK: 'rgb(223,226,234)',
  WHITE: 'rgb(46,48,51)'
} as const

export const getStrokeColor = (): typeof StrokeColor[keyof typeof StrokeColor] => {
  const isDark = document.documentElement.classList.contains('theme_dark') ?? true

  return isDark ? StrokeColor.DARK : StrokeColor.WHITE
}
