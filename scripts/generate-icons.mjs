/**
 * Rasterises the brand mark in `app/icon.svg` into the two icons that cannot be
 * SVG: `app/favicon.ico` for browsers that still ask for it, and
 * `app/apple-icon.png` for the iOS home screen.
 *
 * `app/icon.svg` is the source of truth. Change the mark there, then run:
 *   node scripts/generate-icons.mjs
 */
import { readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import sharp from 'sharp'

const appDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'app')

/** The .ico container, with each size stored as a PNG. */
function buildIco(images) {
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0) // reserved
  header.writeUInt16LE(1, 2) // 1 = icon
  header.writeUInt16LE(images.length, 4)

  let offset = 6 + images.length * 16
  const entries = images.map(({ size, png }) => {
    const entry = Buffer.alloc(16)
    entry.writeUInt8(size >= 256 ? 0 : size, 0) // 0 stands for 256
    entry.writeUInt8(size >= 256 ? 0 : size, 1)
    entry.writeUInt8(0, 2) // palette size, 0 for true colour
    entry.writeUInt8(0, 3) // reserved
    entry.writeUInt16LE(1, 4) // colour planes
    entry.writeUInt16LE(32, 6) // bits per pixel
    entry.writeUInt32LE(png.length, 8)
    entry.writeUInt32LE(offset, 12)
    offset += png.length
    return entry
  })

  return Buffer.concat([header, ...entries, ...images.map((image) => image.png)])
}

const markSvg = await readFile(join(appDir, 'icon.svg'))

const icoSizes = [16, 32, 48]
const icoImages = await Promise.all(
  icoSizes.map(async (size) => ({
    size,
    png: await sharp(markSvg, { density: 384 }).resize(size, size).png().toBuffer(),
  }))
)
await writeFile(join(appDir, 'favicon.ico'), buildIco(icoImages))

// iOS masks the tile to a rounded square and puts it on the wallpaper, so the
// red bleeds to the edge instead of sitting in a disc.
const appleSvg = markSvg
  .toString()
  .replace('<circle cx="32" cy="32" r="32"', '<rect x="0" y="0" width="64" height="64"')
await writeFile(
  join(appDir, 'apple-icon.png'),
  await sharp(Buffer.from(appleSvg), { density: 720 }).resize(180, 180).png().toBuffer()
)

console.log('Wrote app/favicon.ico and app/apple-icon.png from app/icon.svg')
