'use client';

import { Check, FileText, Play } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

import { URGENCY_CHIP } from './chips';
import { useLanguage } from './LanguageContext';
import { Section } from './Section';

/**
 * The walkthrough clip: sign in, upload a contract, watch the analysis run, land
 * on the extracted record. It is recorded off a 16:10 screen and transcoded
 * before upload, since the original is 85 MB at 60fps:
 *
 *   ffmpeg -i source.mp4 -an -vf "fps=30,scale=1728:1080:flags=lanczos" \
 *     -c:v libx264 -profile:v high -preset slow -crf 25 \
 *     -pix_fmt yuv420p -movflags +faststart walkthrough.mp4
 *
 * DEMO_VIDEO_ASPECT has to match the clip (1728x1080 is 8:5), or the frame
 * shows black bars. Both the Blob pathname and the poster carry a version
 * suffix on purpose: overwriting either in place keeps the URL, so browsers and
 * the image optimiser go on serving the old file until their cache expires. To
 * replace the video, upload under the next version and update the constants:
 *
 *   set -a; . ./.env.local; set +a
 *   vercel blob put walkthrough.mp4 \
 *     --pathname contract-lens-walkthrough-v4.mp4 \
 *     --access public --rw-token "$BLOB_READ_WRITE_TOKEN"
 *   ffmpeg -ss 50 -i walkthrough.mp4 -frames:v 1 -q:v 4 public/walkthrough-poster-v4.jpg
 */
const DEMO_VIDEO_URL =
  'https://gdiqtaqfbz3yltxe.public.blob.vercel-storage.com/contract-lens-walkthrough-v3.mp4';
const DEMO_VIDEO_POSTER = '/walkthrough-poster-v3.jpg';
const DEMO_VIDEO_ASPECT = 'aspect-[8/5]';

/** One tint per step, so the three cards read as three different moments. */
const TINT = ['bg-mist', 'bg-sand', 'bg-sage'] as const;

export function HowItWorks() {
  const { t } = useLanguage();
  const figures = [<UploadFigure key="upload" />, <RecordFigure key="record" />, <DatesFigure key="dates" />];

  return (
    <>
      <Section
        id="how-it-works"
        eyebrow={t.howItWorks.eyebrow}
        title={t.howItWorks.title}
        summary={t.howItWorks.summary}
      >
        {/* The steps are a sequence, so they are numbered. */}
        <ol className="grid gap-5 md:grid-cols-3">
          {t.howItWorks.steps.map((step, index) => (
            <li key={step.title} className="flex flex-col overflow-hidden rounded-2xl border border-rule bg-paper">
              <div aria-hidden="true" className={`flex h-56 items-center justify-center px-6 ${TINT[index]}`}>
                {figures[index]}
              </div>
              <div className="flex flex-1 flex-col p-6">
                <span aria-hidden="true" className="display text-[1.375rem] leading-none text-muted">
                  {index + 1}
                </span>
                <h3 className="mt-3 text-[1.0625rem] font-semibold text-ink">{step.title}</h3>
                <p className="mt-2 text-[15px] leading-[1.6] text-body">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Walkthrough />
    </>
  );
}

/** Step one: the file arrives and is recognised. */
function UploadFigure() {
  const { t } = useLanguage();
  return (
    <div className="w-full max-w-[17rem] rounded-xl border border-dashed border-ink/25 p-3 text-[12px]">
      <div className="flex items-center gap-3 rounded-lg bg-paper px-3 py-2.5 shadow-sheet">
        <FileText className="h-4 w-4 shrink-0 text-ink" />
        <span className="truncate font-medium text-ink">{t.extract.doc.fileName}</span>
      </div>
      <div className="mt-3 flex items-center gap-2 px-1 text-muted">
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-beck" />
        <span className="truncate">
          {t.extract.recognizedLabel} <span className="font-medium text-ink">{t.extract.recognized}</span>
        </span>
      </div>
    </div>
  );
}

/** Step two: three of the fields, checked. */
function RecordFigure() {
  const { t } = useLanguage();
  const rows = [t.extract.fields[0], t.extract.fields[1], t.extract.fields[3]];
  return (
    <div className="w-full max-w-[18rem] rounded-xl bg-paper p-1 text-[12px] shadow-sheet">
      {rows.map((field) => (
        <div key={field.label} className="flex items-start gap-3 border-b border-rule px-3 py-2.5 last:border-b-0">
          <div className="min-w-0 flex-1">
            <div className="text-[10px] uppercase tracking-[0.12em] text-muted">{field.label}</div>
            <div className="mt-0.5 truncate font-medium text-ink">{field.value}</div>
          </div>
          <Check className="mt-1 h-3.5 w-3.5 shrink-0 text-ink" />
        </div>
      ))}
    </div>
  );
}

/** Step three: the list, sorted by what comes first. */
function DatesFigure() {
  const { t } = useLanguage();
  const rows = t.deadlines.list.rows.slice(0, 3);
  return (
    <div className="w-full max-w-[18rem] rounded-xl bg-paper p-1 text-[12px] shadow-sheet">
      {rows.map((row) => (
        <div key={row.title} className="flex items-center justify-between gap-3 border-b border-rule px-3 py-2.5 last:border-b-0">
          <span className="truncate font-medium text-ink">{row.title}</span>
          <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium tabular-nums ${URGENCY_CHIP[row.urgency]}`}>
            {row.ends}
          </span>
        </div>
      ))}
    </div>
  );
}

function Walkthrough() {
  const { t } = useLanguage();
  const [playing, setPlaying] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);

  // The play badge can be in view while the top of the frame is still behind
  // the navbar; nudge the least amount needed once the video takes over.
  useEffect(() => {
    if (!playing) return;
    frameRef.current?.scrollIntoView({ behavior: 'auto', block: 'nearest' });
  }, [playing]);

  return (
    <Section id="walkthrough" title={t.howItWorks.videoTitle} summary={t.howItWorks.videoBody} tone="ledger" layout="center">
      <div ref={frameRef} className="mx-auto max-w-[960px] scroll-mt-24">
        {playing ? (
          <div className={`overflow-hidden rounded-2xl bg-ink shadow-sheet ${DEMO_VIDEO_ASPECT}`}>
            <video
              src={DEMO_VIDEO_URL}
              poster={DEMO_VIDEO_POSTER}
              className="h-full w-full object-cover"
              controls
              autoPlay
              playsInline
            />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={t.howItWorks.playAria}
            className={`group relative block w-full overflow-hidden rounded-2xl bg-ink text-left shadow-sheet ${DEMO_VIDEO_ASPECT}`}
          >
            <Image
              src={DEMO_VIDEO_POSTER}
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 960px"
              className="object-cover opacity-90 transition-opacity duration-300 group-hover:opacity-100"
            />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="btn btn-light shadow-[0_8px_24px_rgba(0,0,0,0.25)]">
                <Play className="h-4 w-4 fill-current" aria-hidden="true" />
                {t.howItWorks.play}
              </span>
            </span>
          </button>
        )}
      </div>
    </Section>
  );
}
