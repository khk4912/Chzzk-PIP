import { Plugin } from 'vite'
import { promises as fs } from 'fs'
import { resolve } from 'path'

export function rmDotVite (): Plugin {
  return {
    name: 'rm-dot-vite',
    async buildEnd () {
      const buildDir = resolve(__dirname, '../dist-firefox')
      const dotViteDir = resolve(buildDir, '.vite')

      try {
        await fs.rm(dotViteDir, { recursive: true })
      } catch (error) {

      }
    }
  }
}
