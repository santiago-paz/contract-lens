/**
 * Draws the brand mark: the lens.
 *
 * A filled disc with a smaller disc cut out of it, up and to the right. The
 * two circles are concentric nowhere, so what is left is a crescent that
 * thins toward the bite and thickens opposite it. It reads as a lens, an
 * aperture or an eye, which is the name of the product.
 *
 * The cut is an even-odd hole in one path rather than a second shape in the
 * ground colour, so the mark works on any ground: it can be filled white on
 * the ink tile, or ink on paper, and the bite stays a hole either way.
 *
 * The thinnest part of the crescent is `R - (offset + r)`, about 2.95 units
 * in the 48 box. At a 16px favicon that is just under a pixel, so it lands as
 * a soft grey arc rather than a crisp one. That is the intended reading: the
 * crescent closes into a ring at tab size and keeps its shape.
 *
 * Every number below is a dial. Change one, then run:
 *   node scripts/generate-icons.mjs
 * which rewrites `lib/brand-mark.ts` and every icon from this drawing.
 */

export const DEFAULTS = {
  box: 48, // the box the mark is drawn in
  radius: 15, // the outer disc
  bite: 6.75, // the disc cut out of it
  biteX: 3.75, // how far the cut sits right of centre
  biteY: -3.75, // and above it
}

const r = (n) => Math.round(n * 100) / 100

/** One circle as a closed subpath of two half-arcs. */
function circle(cx, cy, rad) {
  return (
    `M${r(cx - rad)} ${r(cy)}` +
    `a${r(rad)} ${r(rad)} 0 1 0 ${r(rad * 2)} 0` +
    `a${r(rad)} ${r(rad)} 0 1 0 ${r(-rad * 2)} 0Z`
  )
}

/**
 * The lens: the outer disc, then the bite. Fill it with `fill-rule: evenodd`
 * so the second subpath knocks a hole rather than painting over it.
 */
export function markPath(overrides = {}) {
  const p = { ...DEFAULTS, ...overrides }
  const c = p.box / 2
  return circle(c, c, p.radius) + circle(c + p.biteX, c + p.biteY, p.bite)
}

/** The thinnest part of the crescent, in box units. */
export function thinnest(overrides = {}) {
  const p = { ...DEFAULTS, ...overrides }
  return p.radius - (Math.hypot(p.biteX, p.biteY) + p.bite)
}
