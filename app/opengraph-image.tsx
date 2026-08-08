import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const alt =
  'Contract Lens — the Enterprise Asset OS. Upload a contract, get structured fields, deadlines and alerts.'

export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

const INK = '#000000'
const PAPER = '#ffffff'
const ACCENT = '#CCFF00'
const GRID = '#f0f0f0'
const MUTED = '#6b7280'

/** The fields the extraction pipeline pulls out of a ServiceAgreement. */
const EXTRACTED_FIELDS = [
  ['PARTIES', 'Meyer GmbH / Kleine AG'],
  ['TERM', '24 months'],
  ['NOTICE PERIOD', '3 months'],
  ['AUTO-RENEWAL', 'Yes'],
  ['GOVERNING LAW', 'German law (BGB)'],
] as const

export default async function Image() {
  const [monoBold, monoRegular, sans] = await Promise.all([
    readFile(join(process.cwd(), 'assets/GeistMono-Bold.ttf')),
    readFile(join(process.cwd(), 'assets/GeistMono-Regular.ttf')),
    readFile(join(process.cwd(), 'assets/Geist-Regular.ttf')),
  ])

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          backgroundColor: PAPER,
          // Mirrors .bg-grid-pattern from globals.css
          backgroundImage: `linear-gradient(to right, ${GRID} 1px, transparent 1px), linear-gradient(to bottom, ${GRID} 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          fontFamily: 'Geist Mono',
          padding: 64,
        }}
      >
        {/* Left column — the thesis */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: 600,
          }}
        >
          {/* Wordmark */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 56,
                height: 56,
                backgroundColor: ACCENT,
                border: `2px solid ${INK}`,
                boxShadow: `4px 4px 0px 0px ${INK}`,
                fontSize: 34,
                fontWeight: 700,
                color: INK,
              }}
            >
              §
            </div>
            <div
              style={{
                marginLeft: 18,
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: 2,
                color: INK,
              }}
            >
              CONTRACT LENS
            </div>
          </div>

          {/* Headline block */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                display: 'flex',
                alignSelf: 'flex-start',
                backgroundColor: ACCENT,
                border: `2px solid ${INK}`,
                boxShadow: `2px 2px 0px 0px ${INK}`,
                padding: '7px 14px',
                fontSize: 17,
                fontWeight: 700,
                letterSpacing: 1.5,
                color: INK,
                marginBottom: 26,
              }}
            >
              AI CONTRACT EXTRACTION
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                fontSize: 74,
                fontWeight: 700,
                lineHeight: 1.04,
                letterSpacing: -2.5,
                color: INK,
              }}
            >
              <div style={{ display: 'flex' }}>The Enterprise</div>
              <div style={{ display: 'flex' }}>Asset OS</div>
            </div>

            <div
              style={{
                display: 'flex',
                marginTop: 26,
                fontFamily: 'Geist',
                fontSize: 24,
                lineHeight: 1.42,
                color: MUTED,
                maxWidth: 540,
              }}
            >
              Upload a contract. Get structured fields, deadlines and alerts —
              no prompting required.
            </div>
          </div>

          {/* Footer line */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: 19,
              color: INK,
            }}
          >
            <div
              style={{
                display: 'flex',
                width: 10,
                height: 10,
                backgroundColor: ACCENT,
                border: `2px solid ${INK}`,
                marginRight: 12,
              }}
            />
            contract-lens-web.vercel.app
          </div>
        </div>

        {/* Right column — the signature: what the pipeline actually returns */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: 408,
            marginLeft: 64,
            alignSelf: 'center',
            border: `2px solid ${INK}`,
            boxShadow: `8px 8px 0px 0px ${INK}`,
            backgroundColor: PAPER,
          }}
        >
          {/* Card header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: INK,
              padding: '13px 16px',
            }}
          >
            <div
              style={{
                display: 'flex',
                fontSize: 15,
                fontWeight: 700,
                letterSpacing: 1.2,
                color: PAPER,
              }}
            >
              EXTRACTED
            </div>
            <div
              style={{
                display: 'flex',
                fontSize: 15,
                fontWeight: 700,
                letterSpacing: 1.2,
                color: ACCENT,
              }}
            >
              ServiceAgreement
            </div>
          </div>

          {/* Typed fields */}
          <div style={{ display: 'flex', flexDirection: 'column', padding: 16 }}>
            {EXTRACTED_FIELDS.map(([label, value], i) => (
              <div
                key={label}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  paddingTop: i === 0 ? 0 : 13,
                  paddingBottom: 13,
                  borderBottom:
                    i === EXTRACTED_FIELDS.length - 1
                      ? '0px solid transparent'
                      : `1px solid ${GRID}`,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    fontSize: 13,
                    letterSpacing: 1.1,
                    color: MUTED,
                    marginBottom: 5,
                  }}
                >
                  {label}
                </div>
                <div
                  style={{
                    display: 'flex',
                    fontSize: 20,
                    fontWeight: 700,
                    color: INK,
                  }}
                >
                  {value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Geist Mono', data: monoBold, style: 'normal', weight: 700 },
        { name: 'Geist Mono', data: monoRegular, style: 'normal', weight: 400 },
        { name: 'Geist', data: sans, style: 'normal', weight: 400 },
      ],
    }
  )
}
