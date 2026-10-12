'use client';

import { Pause, Play } from 'lucide-react';

import { useLanguage } from './LanguageContext';
import { usePrefersReducedMotion } from './motion/media';
import { motionPause, usePausedMotion } from './motion/pause';

/**
 * Stops and restarts the motion that runs on its own. It sits on the two blocks
 * that carry a WebGL field, and it is not drawn at all when the visitor already
 * asked for reduced motion, because then nothing moves on its own.
 */
export function MotionToggle({ className = '' }: { className?: string }) {
  const { t } = useLanguage();
  const reduced = usePrefersReducedMotion();
  const paused = usePausedMotion();
  if (reduced) return null;

  const label = paused ? t.motion.resume : t.motion.pause;
  return (
    <button
      type="button"
      onClick={() => motionPause.set(!paused)}
      aria-label={label}
      title={label}
      className={`motion-toggle ${className}`}
    >
      {paused ? <Play className="h-3.5 w-3.5" aria-hidden="true" /> : <Pause className="h-3.5 w-3.5" aria-hidden="true" />}
    </button>
  );
}
