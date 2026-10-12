import { renderShareCard, type ShareCardCopy } from '@/lib/share-card'

export const alt =
  'Contract Lens: upload a contract, get the facts and the deadlines back. Next to the line, ' +
  'the record it fills in for a service agreement: parties, start, term, notice period, liability cap.'

export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

/**
 * The record Contract Lens fills in for a service agreement, as the hero figure
 * shows it. Long values are split by hand: satori does not wrap text the way a
 * browser does, so each line is its own row.
 */
const COPY: ShareCardCopy = {
  headline: ['Upload a contract.', 'Get the facts and', 'the deadlines back.'],
  lead: ['Made for small law firms in Germany.', 'It reads a PDF or Word file and fills in the record.'],
  recordTitle: 'Contract record',
  recognizedLabel: 'Recognized as',
  recognizedValue: 'Service agreement',
  record: [
    { label: 'Parties', value: ['Habermann Logistik GmbH and', 'Nordlicht Software GmbH'] },
    { label: 'Start', value: ['1 January 2025'] },
    { label: 'End or term', value: ['24 months'] },
    { label: 'Notice period', value: ['3 months to the end of the term'] },
    { label: 'Liability cap', value: ['EUR 50,000 per contract year'] },
  ],
}

export default function Image() {
  return renderShareCard(COPY)
}
