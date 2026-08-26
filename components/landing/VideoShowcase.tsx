'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Play } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

import { useLanguage } from './LanguageContext';

/**
 * Demo video configuration.
 *
 * The clip is the August 2026 walkthrough: sign in, upload a contract, watch the
 * analysis run, land on the extracted record. The recording comes off a 16:10
 * screen (3456x2160), and it is transcoded before upload, since the original is
 * 85 MB at 60fps:
 *
 *   ffmpeg -i source.mp4 -an -vf "fps=30,scale=1728:1080:flags=lanczos" \
 *     -c:v libx264 -profile:v high -preset slow -crf 25 \
 *     -pix_fmt yuv420p -movflags +faststart walkthrough.mp4
 *
 * DEMO_VIDEO_ASPECT has to match the clip, so re-derive it from the encoded
 * width and height rather than assuming 16:9. A 16:9 frame is what put black
 * bars down both sides of this 16:10 recording. The frame is object-cover
 * rather than object-contain for the same reason: aspect-ratio sizes the
 * border box while object-fit works on the content box inside the 2px border,
 * and cover absorbs that difference instead of leaving a sliver of black.
 *
 * Both the Blob pathname and the poster filename carry a version suffix, and
 * that is deliberate. Overwriting either one in place keeps the URL identical,
 * so browsers and the Vercel image optimiser go on serving the previous file
 * until their cache expires. Bumping the suffix makes the swap take effect at
 * once. To replace the video, upload under the next version and update the
 * three constants below:
 *
 *   set -a; . ./.env.local; set +a
 *   vercel blob put walkthrough.mp4 \
 *     --pathname contract-lens-walkthrough-v4.mp4 \
 *     --access public --rw-token "$BLOB_READ_WRITE_TOKEN"
 *   ffmpeg -ss 50 -i walkthrough.mp4 -frames:v 1 -q:v 4 public/walkthrough-poster-v4.jpg
 *
 * Leaving DEMO_VIDEO_URL empty falls back to the placeholder state.
 */
const DEMO_VIDEO_URL =
  'https://gdiqtaqfbz3yltxe.public.blob.vercel-storage.com/contract-lens-walkthrough-v3.mp4';
const DEMO_VIDEO_POSTER = '/walkthrough-poster-v3.jpg';
/** 1728x1080, the clip's own ratio. Keep in step with the file above. */
const DEMO_VIDEO_ASPECT = 'aspect-[8/5]';

/**
 * Height budget, so the whole frame is on screen on a short laptop.
 *
 * The frame is as wide as its column, and the ratio above turns that width into
 * height, so on a 1280x720 screen it came out 680px tall. The navbar is fixed
 * and eats 74px once the page has scrolled, the play badge hangs 28px past the
 * bottom edge, and pb-12 sits under that, which left the bottom of the frame
 * about 60px below the fold with nothing to scroll it into view.
 *
 * Capping the width at (viewport height - 11rem) x 1.6 gives the height back to
 * the viewport: 870px wide at 720px tall, full 1088px again from 856px tall up,
 * so ordinary laptops and desktops see no change. The cap is a max-width rather
 * than a max-height because aspect-ratio derives height from width; clamping the
 * height instead would just break the ratio and put the black bars back.
 *
 * No mx-auto: the frame stays flush left under the heading like the rest of the
 * section, and the slack shows up on the right.
 */
const DEMO_VIDEO_MAX_WIDTH = 'max-w-[calc((100svh-11rem)*1.6)]';

export function VideoShowcase() {
  const { t } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const reduceMotion = useReducedMotion();
  const frameRef = useRef<HTMLDivElement>(null);

  // The frame fits the viewport now, but only once it has been scrolled to, so
  // correct for the case where the play badge is in view and the top of the
  // frame is still up behind the navbar. block: 'nearest' with the scroll-mt
  // below does nothing when the frame is already clear and otherwise moves the
  // least it can. The move is instant rather than smooth: it is a short nudge
  // landing on the same frame as the poster turning into the video, and an
  // animated scroll would be a second, interruptible thing happening at once.
  useEffect(() => {
    if (!isPlaying) return;
    frameRef.current?.scrollIntoView({ behavior: 'auto', block: 'nearest' });
  }, [isPlaying]);

  const scrollToContact = () => {
    document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-title"
      className="scroll-mt-24 py-24 sm:py-32 bg-white relative overflow-hidden border-b-2 border-black bg-noise"
    >
      <div className="absolute inset-0 bg-grid-pattern opacity-100 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-14 max-w-3xl">
          <h2
            id="how-it-works-title"
            className="text-4xl sm:text-5xl font-black text-black uppercase tracking-tighter mb-6"
          >
            {t.videoShowcase.titlePart1}{' '}
            <span className="bg-black text-white px-2 inline-block">
              {t.videoShowcase.titlePart2}
            </span>
          </h2>
          <p className="text-lg font-mono text-black/80 border-l-4 border-black pl-4">
            {t.videoShowcase.subtitle}
          </p>
        </div>

        <motion.div
          ref={frameRef}
          initial={{ opacity: 0, y: reduceMotion ? 0 : 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: reduceMotion ? 0 : 0.5, ease: 'circOut' }}
          className={`relative pb-12 scroll-mt-28 ${DEMO_VIDEO_MAX_WIDTH}`}
        >
          {DEMO_VIDEO_URL ? (
            isPlaying ? (
              <div className={`border-2 border-black bg-black shadow-[10px_10px_0px_0px_#CCFF00] ${DEMO_VIDEO_ASPECT}`}>
                <video
                  src={DEMO_VIDEO_URL}
                  poster={DEMO_VIDEO_POSTER || undefined}
                  className="w-full h-full object-cover"
                  controls
                  autoPlay
                  playsInline
                />
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsPlaying(true)}
                aria-label={t.videoShowcase.playAria}
                className="group relative block w-full text-left touch-manipulation focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-black"
              >
                <div className={`border-2 border-black bg-black shadow-[10px_10px_0px_0px_#CCFF00] ${DEMO_VIDEO_ASPECT} relative overflow-hidden`}>
                  {DEMO_VIDEO_POSTER && (
                    <Image
                      src={DEMO_VIDEO_POSTER}
                      alt=""
                      fill
                      sizes="(max-width: 1024px) 100vw, 1024px"
                      className="object-cover"
                      priority={false}
                    />
                  )}
                </div>

                <span className="pointer-events-none absolute bottom-0 left-4 sm:left-8 translate-y-1/2 inline-flex items-center gap-3 bg-[#CCFF00] text-black border-2 border-black px-6 py-4 shadow-hard font-mono font-bold uppercase tracking-widest text-sm transition-[translate,box-shadow] duration-150 group-hover:translate-x-[3px] group-hover:shadow-none group-active:translate-x-[3px] group-active:shadow-none">
                  <Play className="w-5 h-5 fill-black" aria-hidden="true" />
                  {t.videoShowcase.play}
                </span>
              </button>
            )
          ) : (
            <div className="border-2 border-black bg-black shadow-[10px_10px_0px_0px_#CCFF00] aspect-video relative overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

              <div className="relative z-10 text-center px-6 max-w-lg">
                <p className="text-2xl sm:text-3xl font-mono font-black text-white uppercase tracking-tighter mb-4">
                  {t.videoShowcase.placeholderTitle}
                </p>
                <p className="font-mono text-sm text-gray-400 uppercase leading-relaxed mb-8">
                  {t.videoShowcase.placeholderBody}
                </p>
                <button
                  type="button"
                  onClick={scrollToContact}
                  className="inline-flex items-center justify-center px-6 py-3 text-sm font-bold font-mono uppercase tracking-wider touch-manipulation bg-[#CCFF00] text-black border-2 border-black shadow-hard transition-[translate,box-shadow] duration-150 hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-white"
                >
                  {t.videoShowcase.placeholderCta}
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
