import { renderShareCard, type ShareCardCopy } from '@/lib/share-card'

export const alt =
  'Contract Lens: Vertrag hochladen, Fakten und Fristen zurückbekommen. Daneben die Akte, die die ' +
  'Software für einen Dienstleistungsvertrag ausfüllt: Parteien, Beginn, Laufzeit, Kündigungsfrist, Haftungsobergrenze.'

export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

/** The same card in German, with the same record as the German hero figure shows it. */
const COPY: ShareCardCopy = {
  headline: ['Vertrag hochladen.', 'Fakten und Fristen', 'zurückbekommen.'],
  lead: ['Gemacht für kleine Kanzleien in Deutschland.', 'Sie liest PDF oder Word und füllt die Akte aus.'],
  recordTitle: 'Vertragsakte',
  recognizedLabel: 'Erkannt als',
  recognizedValue: 'Dienstleistungsvertrag',
  record: [
    { label: 'Parteien', value: ['Habermann Logistik GmbH und', 'Nordlicht Software GmbH'] },
    { label: 'Beginn', value: ['1. Januar 2025'] },
    { label: 'Ende oder Laufzeit', value: ['24 Monate'] },
    { label: 'Kündigungsfrist', value: ['3 Monate zum Laufzeitende'] },
    { label: 'Haftungsobergrenze', value: ['50.000 EUR je Vertragsjahr'] },
  ],
}

export default function Image() {
  return renderShareCard(COPY)
}
