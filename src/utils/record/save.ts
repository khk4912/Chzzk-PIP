export const sanitizeFileName = (name: string): string => {
  return name.replace(/[/\\?%*:|"<>]/g, '_')
}
