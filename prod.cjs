const fs = require('fs')
const path = require('path')
const archiver = require('archiver')
const manifest = require('./manifest.json')

const distChrome = path.resolve(__dirname, 'dist')
const distFirefox = path.resolve(__dirname, 'dist-firefox')

if (!fs.existsSync(path.resolve(__dirname, 'packages'))) {
  fs.mkdirSync(path.resolve(__dirname, 'packages'))
}

const chromeOutput = path.resolve(
  __dirname,
  `packages/${manifest.name}-v${manifest.version}.zip`
)
const firefoxOutput = path.resolve(
  __dirname,
  `packages/${manifest.name}-v${manifest.version}-firefox.zip`
)

const chromeZip = fs.createWriteStream(chromeOutput)
const firefoxZip = fs.createWriteStream(firefoxOutput)

const archive = archiver('zip', { zlib: { level: 9 } })

chromeZip.on('close', () => {
  console.log(
    `Finished dist folder: ${chromeOutput} (${archive.pointer()} bytes)`
  )
})
firefoxZip.on('close', () => {
  console.log(
    `Finished dist-firefox folder: ${firefoxOutput} (${archive.pointer()} bytes)`
  )
})

archive.on('error', (err) => {
  throw err
})

archive.pipe(chromeZip)
archive.directory(distChrome, false)

archive.pipe(firefoxZip)
archive.directory(distFirefox, false)

archive.finalize()
