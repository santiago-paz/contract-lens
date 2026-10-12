import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

import { MARK_PATH } from '@/lib/brand-mark'

/*
 * The share card: the landing in miniature, at 1200 by 630. The layout lives here
 * once, and each language's route (app/opengraph-image.tsx, app/de/opengraph-image.tsx)
 * passes in its own copy.
 */

export const SHARE_CARD_SIZE = { width: 1200, height: 630 } as const

/** The words on the card, in one language. */
export interface ShareCardCopy {
  /** One line per entry: satori does not wrap text the way a browser does. */
  headline: readonly string[]
  lead: readonly string[]
  recordTitle: string
  recognizedLabel: string
  recognizedValue: string
  record: readonly { label: string; value: readonly string[] }[]
}

// The landing tokens, from the @theme block in globals.css.
const PAPER = '#ffffff'
const INK = '#16181d'
const BODY = '#3f444c'
const MUTED = '#5f6670'
const RULE = '#e1e2dd'
const NAVY = '#1a2742'
const NAVY_CREST = '#1c2946'
const NAVY_FLOOR = '#151f37'
const NAVY_LIT = '#27365b'
const BECK = '#a3202f'

const PANEL = 520 // the navy block, the same one the landing's sections use
const SHEET = 424 // the record, floating on it

/**
 * The measure: the page's own 24px gutter pitch, with a heavier mark every
 * fifth. It fades in from the shaded side of the block and is gone by the time
 * it reaches the light, so the lit side of the band stays clean.
 */
const TICKS = Array.from({ length: Math.floor(PANEL / 24) }, (_, i) => {
  const x = (i + 1) * 24
  const fade = Math.max(0, Math.min(1, (x / PANEL - 0.28) / 0.72))
  return { x, opacity: ((i + 1) % 5 === 0 ? 0.13 : 0.07) * fade }
}).filter((tick) => tick.opacity > 0.004)

export async function renderShareCard(copy: ShareCardCopy) {
  // One literal path per file, so Next's file tracing bundles the fonts into
  // the serverless function. A path built at runtime is not traced, and the
  // route then fails on the deployed site.
  const [serif, plexRegular, plexMedium, plexSemiBold] = await Promise.all([
    readFile(join(process.cwd(), 'assets/SourceSerif4-Medium.ttf')),
    readFile(join(process.cwd(), 'assets/IBMPlexSans-Regular.ttf')),
    readFile(join(process.cwd(), 'assets/IBMPlexSans-Medium.ttf')),
    readFile(join(process.cwd(), 'assets/IBMPlexSans-SemiBold.ttf')),
  ])

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', backgroundColor: PAPER, fontFamily: 'IBM Plex Sans' }}>
        {/* Paper: the mark, the claim, the address. It takes no light and no
            measure, because it is what a reader reads on. */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: 1200 - PANEL,
            padding: '64px 56px 64px 72px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <svg width="44" height="44" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="32" fill={BECK} />
              <path d={MARK_PATH} fill={PAPER} />
            </svg>
            <div style={{ marginLeft: 13, fontSize: 22, fontWeight: 600, letterSpacing: -0.22, color: INK }}>
              Contract Lens
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                fontFamily: 'Source Serif 4',
                fontWeight: 500,
                fontSize: 56,
                lineHeight: 1.06,
                letterSpacing: -1.12,
                color: INK,
              }}
            >
              {copy.headline.map((line) => (
                <div key={line} style={{ display: 'flex' }}>
                  {line}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', marginTop: 26, fontSize: 19, lineHeight: 1.55, color: BODY }}>
              {copy.lead.map((line) => (
                <div key={line} style={{ display: 'flex' }}>
                  {line}
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', fontSize: 17, fontWeight: 500, color: MUTED }}>trycontractlens.com</div>
        </div>

        {/* The navy block, lit from the side that faces the paper, with the
            record floating on it. */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            width: PANEL,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: NAVY,
            backgroundImage: `linear-gradient(180deg, ${NAVY_CREST} 0%, ${NAVY} 42%, ${NAVY_FLOOR} 100%)`,
          }}
        >
          {/* The same ground the landing's navy sections use: a pool of light
              at 18% across, dropped in from above the top edge, over the
              crest-to-floor grade. See `.landing .tone-navy::before`. */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: PANEL,
              height: 630,
              display: 'flex',
              backgroundImage: `radial-gradient(85% 70% at 18% -8%, ${NAVY_LIT} 0%, rgba(39, 54, 91, 0) 58%)`,
            }}
          />
          {/* The measure, in the shade the light leaves behind */}
          {TICKS.map(({ x, opacity }) => (
            <div
              key={x}
              style={{
                position: 'absolute',
                top: 0,
                left: x,
                width: 1,
                height: 630,
                backgroundImage: `linear-gradient(180deg, rgba(255, 255, 255, ${opacity.toFixed(3)}) 0%, rgba(255, 255, 255, 0) 84%)`,
              }}
            />
          ))}
          {/* The hairline that catches the block's top edge */}
          <div style={{ position: 'absolute', top: 0, left: 0, width: PANEL, height: 1, backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: SHEET,
              borderRadius: 14,
              backgroundColor: PAPER,
              boxShadow: '0 26px 56px -22px rgba(9, 14, 26, 0.62)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 20px',
                borderBottom: `1px solid ${RULE}`,
              }}
            >
              <div style={{ display: 'flex', fontSize: 10.5, fontWeight: 500, letterSpacing: 1.26, color: MUTED }}>
                {copy.recordTitle.toUpperCase()}
              </div>
              <div style={{ display: 'flex', fontSize: 12, color: MUTED }}>
                {copy.recognizedLabel}
                <span style={{ marginLeft: 5, fontWeight: 500, color: INK }}>{copy.recognizedValue}</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', padding: '0 20px' }}>
              {copy.record.map(({ label, value }, i) => (
                <div
                  key={label}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '14px 0',
                    borderBottom: i === copy.record.length - 1 ? 'none' : `1px solid ${RULE}`,
                  }}
                >
                  <div style={{ display: 'flex', fontSize: 10.5, fontWeight: 500, letterSpacing: 1.26, color: MUTED }}>
                    {label.toUpperCase()}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', marginTop: 6, fontSize: 16, fontWeight: 500, lineHeight: 1.35, color: INK }}>
                    {value.map((line) => (
                      <div key={line} style={{ display: 'flex' }}>
                        {line}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...SHARE_CARD_SIZE,
      fonts: [
        { name: 'Source Serif 4', data: serif, style: 'normal', weight: 500 },
        { name: 'IBM Plex Sans', data: plexRegular, style: 'normal', weight: 400 },
        { name: 'IBM Plex Sans', data: plexMedium, style: 'normal', weight: 500 },
        { name: 'IBM Plex Sans', data: plexSemiBold, style: 'normal', weight: 600 },
      ],
    }
  )
}
