/**
 * Draws the section sign of the brand mark.
 *
 * The sign is not set in a typeface. A typeset § fills in below about 24px,
 * and the mark has to hold at 16px in a browser tab, so it is cut for the
 * disc: a fuller sign on a heavier stroke, with the counters held open.
 *
 * One S is drawn and turned 180 degrees about the centre of the disc for the
 * other half, so the two halves cannot drift apart. Its centreline is offset
 * by a width that runs thin at the terminals and thick across the spine,
 * which is how a serif S is cut.
 *
 * Every number below is a dial. Change one, then run:
 *   node scripts/generate-icons.mjs
 * which rewrites `lib/brand-mark.ts` and every icon from this drawing.
 */

export const DEFAULTS = {
  glyphH: 41, // outer height of the whole sign, in the 64 disc
  glyphW: 23, // outer width
  thick: 6.4, // the stroke across the spine
  thin: 4.0, // the stroke through the bowls
  tip: 0.46, // the terminal's width, as a share of the thick
  plateau: 0.8, // lower = the thick holds for longer before it tapers
  taper: 0.16, // the share of the stroke over which the terminal narrows
  capShear: 1.1, // how far the cut at a terminal leans, in half-widths
  hsRatio: 0.66, // each S's height as a share of the sign's height
  bowlRy: 0.25, // a bowl's vertical radius, as a share of its own S
  phi0: -28, // where the terminal sits on the bowl, in degrees from the right
  phi1: -208, // where the bowl hands over to the spine
  joinEase: 12, // how hard the bowl-to-spine corner is rounded
  nodes: 15, // curve nodes per edge in the emitted path
}

const r = (n) => Math.round(n * 100) / 100

/**
 * The S centreline, traced from the top-right terminal round to the
 * bottom-left one.
 *
 * The upper half is an arc on an ellipse: the bowl. The lower half is that
 * same arc turned 180 degrees about the centre of the S, so the spine falls
 * out of the join and the S can never come out lopsided.
 */
export function spineOf(p, n = 26) {
  const half = p.thick / 2
  const y0 = 32 - p.glyphH / 2 + half
  const y1 = 32 + p.glyphH / 2 - half
  const h = (y1 - y0) * p.hsRatio
  const rx = (p.glyphW - p.thick) / 2
  const ry = h * p.bowlRy
  const sy0 = y0
  const cy = sy0 + h / 2 // the centre of this S
  const uy = sy0 + ry // the centre of its upper bowl

  const bowl = []
  for (let i = 0; i <= n; i++) {
    const phi = ((p.phi0 + ((p.phi1 - p.phi0) * i) / n) * Math.PI) / 180
    bowl.push([32 + rx * Math.cos(phi), uy + ry * Math.sin(phi)])
  }
  const full = [...bowl, ...bowl.map(([x, y]) => [64 - x, 2 * cy - y]).reverse()]
  return smooth(full, p.joinEase)
}

/** Rounds the corner where a bowl hands over to the spine. The arcs themselves
 * are sampled densely enough that the average leaves them alone. */
function smooth(poly, passes) {
  let out = poly
  for (let k = 0; k < passes; k++) {
    out = out.map((pt, i) => {
      if (i === 0 || i === out.length - 1) return pt
      const [a, b, c] = [out[i - 1], pt, out[i + 1]]
      return [(a[0] + 2 * b[0] + c[0]) / 4, (a[1] + 2 * b[1] + c[1]) / 4]
    })
  }
  return out
}

function arcLengths(poly) {
  const acc = [0]
  for (let i = 1; i < poly.length; i++) acc.push(acc[i - 1] + Math.hypot(poly[i][0] - poly[i - 1][0], poly[i][1] - poly[i - 1][1]))
  const total = acc[acc.length - 1]
  return acc.map((v) => v / total)
}

/**
 * The stroke width along the centreline: the serif modulation across the
 * spine, and on top of it a short taper into each terminal.
 */
function widthAt(s, p) {
  const body = p.thin + (p.thick - p.thin) * Math.pow(Math.sin(Math.PI * s), p.plateau)
  const edge = Math.min(s, 1 - s) / p.taper
  if (edge >= 1) return body
  const tip = p.thick * p.tip
  return tip + (body - tip) * (0.5 - 0.5 * Math.cos(Math.PI * edge))
}

/** Both offset edges of the centreline, closed with a leaning cut at each end. */
function outline(poly, p) {
  const s = arcLengths(poly)
  const left = []
  const right = []
  for (let i = 0; i < poly.length; i++) {
    const a = poly[Math.max(0, i - 1)]
    const b = poly[Math.min(poly.length - 1, i + 1)]
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1
    const tx = (b[0] - a[0]) / len
    const ty = (b[1] - a[1]) / len
    const half = widthAt(s[i], p) / 2
    // The cut at a terminal leans, so the outer edge runs past the inner one.
    const lean = i === 0 ? -p.capShear * half : i === poly.length - 1 ? p.capShear * half : 0
    left.push([poly[i][0] - ty * half + tx * lean, poly[i][1] + tx * half + ty * lean])
    right.push([poly[i][0] + ty * half - tx * lean, poly[i][1] - tx * half - ty * lean])
  }
  return [left, right.reverse()]
}

/** Keeps `n` points, always including both ends. */
function thin(points, n) {
  if (points.length <= n) return points
  return Array.from({ length: n }, (_, i) => points[Math.round((i * (points.length - 1)) / (n - 1))])
}

/** Cubic segments through the points, with Catmull-Rom tangents. */
function curve(points) {
  let d = ''
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i]
    const [p1, p2] = [points[i], points[i + 1]]
    const p3 = points[i + 2] ?? points[i + 1]
    d +=
      `C${r(p1[0] + (p2[0] - p0[0]) / 6)} ${r(p1[1] + (p2[1] - p0[1]) / 6)}` +
      ` ${r(p2[0] - (p3[0] - p1[0]) / 6)} ${r(p2[1] - (p3[1] - p1[1]) / 6)}` +
      ` ${r(p2[0])} ${r(p2[1])}`
  }
  return d
}

/** One closed S: two curved edges joined by the straight cut at each terminal. */
function ring([left, right], n) {
  const a = thin(left, n)
  const b = thin(right, n)
  return `M${r(a[0][0])} ${r(a[0][1])}` + curve(a) + `L${r(b[0][0])} ${r(b[0][1])}` + curve(b) + 'Z'
}

export function markPath(overrides = {}) {
  const p = { ...DEFAULTS, ...overrides }
  const edges = outline(spineOf(p), p)
  const turned = edges.map((edge) => edge.map(([x, y]) => [64 - x, 64 - y]))
  return ring(edges, p.nodes) + ring(turned, p.nodes)
}
