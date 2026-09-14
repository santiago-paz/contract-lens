import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const alt =
  'Contract Lens - contract management for small law firms. Upload a contract, get the facts and the deadlines back.'

export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

// Mirrors the landing tokens in globals.css.
const INK = '#1a1c20'
const PAPER = '#ffffff'
const LEDGER = '#f4f4f1'
const RULE = '#d8d9d4'
const MUTED = '#5d6470'
const BECK = '#a3202f'
const BECK_TINT = '#fbeef0'

/** The fields the extraction pipeline fills in for a service agreement. */
const EXTRACTED_FIELDS = [
  ['Parties', 'Habermann Logistik GmbH and Nordlicht Software GmbH'],
  ['Term', '1 Jan 2025 to 31 Dec 2026'],
  ['Renewal and notice', 'Renews for 12 months. Notice: 3 months'],
  ['Liability cap', 'EUR 50,000 per contract year'],
] as const

export default async function Image() {
  const [sansRegular, monoBold] = await Promise.all([
    readFile(join(process.cwd(), 'assets/Geist-Regular.ttf')),
    readFile(join(process.cwd(), 'assets/GeistMono-Bold.ttf')),
  ])

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          backgroundColor: PAPER,
          fontFamily: 'Geist',
          padding: 64,
        }}
      >
        {/* Left column: the thesis */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: 620,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 52,
                height: 52,
                borderRadius: 6,
                backgroundColor: BECK,
                fontFamily: 'Geist Mono',
                fontSize: 30,
                fontWeight: 700,
                color: PAPER,
              }}
            >
              §
            </div>
            <div style={{ marginLeft: 16, fontSize: 24, fontWeight: 700, color: INK, fontFamily: 'Geist Mono' }}>
              Contract Lens
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                display: 'flex',
                fontFamily: 'Geist Mono',
                fontSize: 15,
                fontWeight: 700,
                letterSpacing: 2,
                color: BECK,
                marginBottom: 22,
              }}
            >
              CONTRACT MANAGEMENT FOR SMALL LAW FIRMS
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                fontSize: 62,
                lineHeight: 1.08,
                letterSpacing: -1.5,
                color: INK,
              }}
            >
              <div style={{ display: 'flex' }}>Upload a contract.</div>
              <div style={{ display: 'flex' }}>Get the facts and</div>
              <div style={{ display: 'flex' }}>the deadlines back.</div>
            </div>
          </div>

          <div style={{ display: 'flex', fontSize: 20, color: MUTED }}>trycontractlens.com</div>
        </div>

        {/* Right column: the record the pipeline fills in */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: 388,
            marginLeft: 64,
            alignSelf: 'center',
            border: `1px solid ${RULE}`,
            borderRadius: 6,
            backgroundColor: LEDGER,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '12px 18px',
              borderBottom: `1px solid ${RULE}`,
              fontFamily: 'Geist Mono',
              fontSize: 12,
              letterSpacing: 1.5,
              color: MUTED,
            }}
          >
            <div style={{ display: 'flex' }}>CONTRACT RECORD</div>
            <div style={{ display: 'flex', color: INK }}>SERVICE AGREEMENT</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', padding: '4px 18px 6px' }}>
            {EXTRACTED_FIELDS.map(([label, value], i) => (
              <div
                key={label}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '12px 0',
                  borderBottom: i === EXTRACTED_FIELDS.length - 1 ? '0px solid transparent' : `1px solid ${RULE}`,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    fontFamily: 'Geist Mono',
                    fontSize: 11,
                    letterSpacing: 1.5,
                    color: MUTED,
                    marginBottom: 5,
                  }}
                >
                  {label.toUpperCase()}
                </div>
                <div style={{ display: 'flex', fontSize: 17, color: INK }}>{value}</div>
              </div>
            ))}
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '14px 18px',
              borderTop: `1px solid ${RULE}`,
              backgroundColor: BECK_TINT,
            }}
          >
            <div
              style={{
                display: 'flex',
                fontFamily: 'Geist Mono',
                fontSize: 11,
                letterSpacing: 1.5,
                color: BECK,
                marginBottom: 4,
              }}
            >
              GIVE NOTICE BY
            </div>
            <div style={{ display: 'flex', fontSize: 22, fontWeight: 700, color: INK, fontFamily: 'Geist Mono' }}>
              30 Sep 2026
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Geist', data: sansRegular, style: 'normal', weight: 400 },
        { name: 'Geist Mono', data: monoBold, style: 'normal', weight: 700 },
      ],
    }
  )
}
