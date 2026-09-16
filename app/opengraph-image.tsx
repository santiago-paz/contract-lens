import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const alt =
  'Contract Lens: upload a contract, get the facts and the deadlines back. Next to the line, ' +
  'the record it fills in for a service agreement: parties, start, term, notice period, liability cap.'

export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

// The landing tokens, from the @theme block in globals.css.
const PAPER = '#ffffff'
const INK = '#16181d'
const MUTED = '#5f6670'
const RULE = '#e1e2dd'
const NAVY = '#1a2742'
const BECK = '#a3202f'

/**
 * The record Contract Lens fills in for a service agreement, as the hero figure
 * shows it. Long values are split by hand: satori does not wrap text the way a
 * browser does, so each line is its own row.
 */
const RECORD = [
  { label: 'Parties', value: ['Habermann Logistik GmbH and', 'Nordlicht Software GmbH'] },
  { label: 'Start', value: ['1 January 2025'] },
  { label: 'End or term', value: ['24 months'] },
  { label: 'Notice period', value: ['3 months to the end of the term'] },
  { label: 'Liability cap', value: ['EUR 50,000 per contract year'] },
] as const

const HEADLINE = ['Upload a contract.', 'Get the facts and', 'the deadlines back.'] as const

export default async function Image() {
  // One literal path per file, so Next's file tracing bundles the fonts into
  // the serverless function. A path built at runtime is not traced, and the
  // route then fails on the deployed site.
  const [serifMedium, serifSemiBold, plexRegular, plexMedium, plexSemiBold] = await Promise.all([
    readFile(join(process.cwd(), 'assets/SourceSerif4-Medium.ttf')),
    readFile(join(process.cwd(), 'assets/SourceSerif4-SemiBold.ttf')),
    readFile(join(process.cwd(), 'assets/IBMPlexSans-Regular.ttf')),
    readFile(join(process.cwd(), 'assets/IBMPlexSans-Medium.ttf')),
    readFile(join(process.cwd(), 'assets/IBMPlexSans-SemiBold.ttf')),
  ])

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', backgroundColor: PAPER, fontFamily: 'IBM Plex Sans' }}>
        {/* Paper: the mark, the thesis, the address */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: 664,
            padding: '68px 48px 68px 72px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 42,
                height: 42,
                borderRadius: 21,
                backgroundColor: BECK,
                fontFamily: 'Source Serif 4',
                fontWeight: 600,
                fontSize: 25,
                color: PAPER,
              }}
            >
              §
            </div>
            <div style={{ marginLeft: 13, fontSize: 22, fontWeight: 600, letterSpacing: -0.2, color: INK }}>
              Contract Lens
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', fontSize: 13, fontWeight: 500, letterSpacing: 1.82, color: MUTED }}>
              CONTRACT MANAGEMENT FOR SMALL LAW FIRMS IN GERMANY
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                marginTop: 22,
                fontFamily: 'Source Serif 4',
                fontWeight: 500,
                fontSize: 58,
                lineHeight: 1.06,
                letterSpacing: -1.16,
                color: INK,
              }}
            >
              {HEADLINE.map((line) => (
                <div key={line} style={{ display: 'flex' }}>
                  {line}
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', fontSize: 17, fontWeight: 500, color: MUTED }}>trycontractlens.com</div>
        </div>

        {/* The surface the paper lies on, and the record that comes back filled in */}
        <div
          style={{
            display: 'flex',
            width: 536,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: NAVY,
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: 464,
              borderRadius: 14,
              backgroundColor: PAPER,
              boxShadow: '0 26px 50px -24px rgba(0, 0, 0, 0.55)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '15px 22px',
                borderBottom: `1px solid ${RULE}`,
              }}
            >
              <div style={{ display: 'flex', fontSize: 11, fontWeight: 500, letterSpacing: 1.32, color: MUTED }}>
                CONTRACT RECORD
              </div>
              <div style={{ display: 'flex', fontSize: 12.5, color: MUTED }}>
                Recognized as
                <span style={{ marginLeft: 5, fontWeight: 500, color: INK }}>Service agreement</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', padding: '0 22px' }}>
              {RECORD.map(({ label, value }, i) => (
                <div
                  key={label}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '16px 0',
                    borderBottom: i === RECORD.length - 1 ? 'none' : `1px solid ${RULE}`,
                  }}
                >
                  <div style={{ display: 'flex', fontSize: 11, fontWeight: 500, letterSpacing: 1.32, color: MUTED }}>
                    {label.toUpperCase()}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', marginTop: 7, fontSize: 17, fontWeight: 500, lineHeight: 1.4, color: INK }}>
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
      ...size,
      fonts: [
        { name: 'Source Serif 4', data: serifMedium, style: 'normal', weight: 500 },
        { name: 'Source Serif 4', data: serifSemiBold, style: 'normal', weight: 600 },
        { name: 'IBM Plex Sans', data: plexRegular, style: 'normal', weight: 400 },
        { name: 'IBM Plex Sans', data: plexMedium, style: 'normal', weight: 500 },
        { name: 'IBM Plex Sans', data: plexSemiBold, style: 'normal', weight: 600 },
      ],
    }
  )
}
