/**
 * Draws the brand mark and writes every file that carries it:
 *
 *   lib/brand-mark.ts   the path and its dials, which the app and the share
 *                       card import
 *   app/icon.svg        the mark, for browsers that take an SVG
 *   app/favicon.ico     16, 32 and 48px, for browsers that still ask for it
 *   app/apple-icon.png  180px, for the iOS home screen
 *
 * `scripts/brand-mark.mjs` holds the drawing and its dials. Change a dial
 * there, then run:
 *   node scripts/generate-icons.mjs
 *
 * Every file above is written by this script. None is edited by hand.
 */
import { writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import sharp from 'sharp'

import { DEFAULTS, markPath, thinnest } from './brand-mark.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

/** Ink, the near-black of the wordmark and the primary button. */
const INK = '#16181d'
const PAPER = '#ffffff'

/** The tile's corner, as a share of its box. 12 of 48 is the 8px icon radius at 32px. */
const TILE_RADIUS = 12
/**
 * The lens is lit from the top, the way every band on the page is. The ramp
 * is deliberately narrow: paper down to 0.95 over ink is about twelve RGB
 * points end to end, which is the register the page's own band ramps sit in.
 * A wider fade reads as a glossy sphere at tile size and announces itself as
 * a gradient, which the design system does not allow.
 */
const LIT = 1
const SHADE = 0.95

const BOX = DEFAULTS.box
const MARK_VIEWBOX = `0 0 ${BOX} ${BOX}`
const MARK_PATH = markPath()

/** WCAG relative luminance of an #rrggbb colour. */
function luminance(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/** Paper laid over ink at `alpha`, against the ink under it. */
function litRatio(alpha) {
  const over = [1, 3, 5]
    .map((i) => Math.round(alpha * 255 + (1 - alpha) * parseInt(INK.slice(i, i + 2), 16)))
    .map((n) => n.toString(16).padStart(2, '0'))
    .join('')
  const [a, b] = [luminance(`#${over}`), luminance(INK)]
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
}

/** The light runs down the lens itself, from its top edge to its bottom one. */
const LIT_FROM = BOX / 2 - DEFAULTS.radius
const LIT_TO = BOX / 2 + DEFAULTS.radius

/** The gradient that lights the lens, as its own defs block. */
function litFill(id) {
  return (
    `<linearGradient id="${id}" x1="${BOX / 2}" y1="${LIT_FROM}" x2="${BOX / 2}" y2="${LIT_TO}" gradientUnits="userSpaceOnUse">` +
    `<stop stop-color="${PAPER}" stop-opacity="${LIT}"/>` +
    `<stop offset="1" stop-color="${PAPER}" stop-opacity="${SHADE}"/>` +
    `</linearGradient>`
  )
}

/**
 * The mark on its tile.
 *
 * `ground: 'tile'` is the mark as it ships: the lens on a rounded ink tile.
 * `ground: 'bleed'` squares the tile off for a platform that masks it itself,
 * such as the iOS home screen.
 *
 * There is one cut, and it carries no dark-theme rule. An SVG favicon's
 * `prefers-color-scheme` follows the operating system, not the colour of the
 * tab strip the icon actually lands on, so a dark system with a light browser
 * theme would paint a paper lens onto paper and the mark would disappear.
 * The one cut is safe everywhere: in a dark tab strip the ink tile fades into
 * the browser's own chrome and the paper lens carries the mark on its own,
 * which is exactly what the app does on a dark ground.
 */
function markSvg({ ground = 'tile' } = {}) {
  const corner = ground === 'bleed' ? 0 : TILE_RADIUS
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${MARK_VIEWBOX}" width="${BOX}" height="${BOX}" shape-rendering="geometricPrecision">` +
    `<title>Contract Lens</title>` +
    `<defs>${litFill('lit')}</defs>` +
    `<rect width="${BOX}" height="${BOX}" rx="${corner}" fill="${INK}"/>` +
    `<path fill-rule="evenodd" d="${MARK_PATH}" fill="url(#lit)"/>` +
    `</svg>\n`
  )
}

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

await writeFile(
  join(root, 'lib/brand-mark.ts'),
  `/**
 * The brand mark: the lens.
 *
 * Written by \`scripts/generate-icons.mjs\` from the drawing in
 * \`scripts/brand-mark.mjs\`. Do not edit this file by hand.
 *
 * A disc with a smaller disc cut out of it, up and to the right, so what is
 * left is a crescent that thins toward the bite. The cut is an even-odd hole
 * in one path, not a second shape in the ground colour, so the mark holds on
 * any ground. Fill the path with \`fill-rule: evenodd\`.
 *
 * \`components/landing/Logo.tsx\` and \`app/opengraph-image.tsx\` draw this path;
 * the icons beside it are raster copies of the same drawing.
 *
 * The path is drawn in a ${BOX} by ${BOX} box, on a disc of radius
 * ${DEFAULTS.radius} at (${BOX / 2}, ${BOX / 2}).
 */
export const MARK_PATH =
  '${MARK_PATH}'

/** The box the path is drawn in. */
export const MARK_VIEWBOX = '${MARK_VIEWBOX}'

/** The tile's corner in box units. ${TILE_RADIUS} of ${BOX} is the 8px icon radius at 32px. */
export const MARK_TILE_RADIUS = ${TILE_RADIUS}

/**
 * The lens is lit from the top, the way every band on the page is: paper at
 * ${LIT} where the light lands and ${SHADE} at the foot. On ink that runs from
 * ${litRatio(LIT).toFixed(1)}:1 down to ${litRatio(SHADE).toFixed(1)}:1, so the whole crescent stays well clear of
 * the 3:1 a graphic needs.
 */
export const MARK_LIT = ${LIT}
export const MARK_SHADE = ${SHADE}

/**
 * Where that light runs, in box units: the lens's own top edge down to its
 * bottom one. Draw the gradient on the x axis at ${BOX / 2}.
 */
export const MARK_LIT_FROM = ${LIT_FROM}
export const MARK_LIT_TO = ${LIT_TO}
export const MARK_CENTRE = ${BOX / 2}
`
)

const flat = markSvg()
await writeFile(join(root, 'app/icon.svg'), flat)

const icoSizes = [16, 32, 48]
const icoImages = await Promise.all(
  icoSizes.map(async (size) => ({
    size,
    png: await sharp(Buffer.from(flat), { density: 2400 }).resize(size, size).png().toBuffer(),
  }))
)
await writeFile(join(root, 'app/favicon.ico'), buildIco(icoImages))

// iOS masks the tile to its own rounded square and puts it on the wallpaper,
// so the ink bleeds to the edge instead of carrying our corner. The lens
// already fills 62% of the box, which clears the mask, so it does not grow.
await writeFile(
  join(root, 'app/apple-icon.png'),
  await sharp(Buffer.from(markSvg({ ground: 'bleed' })), { density: 2400 })
    .resize(180, 180)
    .png()
    .toBuffer()
)

console.log(
  `Wrote lib/brand-mark.ts, app/icon.svg, app/favicon.ico and app/apple-icon.png\n` +
    `Thinnest part of the crescent: ${thinnest().toFixed(2)} units ` +
    `(${((thinnest() / BOX) * 16).toFixed(2)}px at a 16px favicon)`
)
