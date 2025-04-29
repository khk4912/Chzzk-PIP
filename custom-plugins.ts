import { Plugin } from 'vite'
import { promises as fs } from 'fs'
import { resolve } from 'path'

export function rmDotVite ({ firefox = false } : { firefox?: boolean }): Plugin {
  return {
    name: 'rm-dot-vite',
    async buildEnd () {
      const buildDir = resolve(__dirname, firefox ? '../dist-firefox' : 'dist')
      const dotViteDir = resolve(buildDir, '.vite')

      try {
        await fs.rm(dotViteDir, { recursive: true })
      } catch (error) {

      }
    }
  }
}
