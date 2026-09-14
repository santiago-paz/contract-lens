'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

import { useCookieConsent } from './CookieContext';
import { useLanguage } from './LanguageContext';
import { DUR, EASE } from './motion';

/** How long the page gets to itself before the banner comes up. */
const DELAY_MS = 1000;

export function CookieConsent() {
  const { t } = useLanguage();
  const { consentStatus, acceptCookies, declineCookies } = useCookieConsent();
  const [delayElapsed, setDelayElapsed] = useState(false);

  useEffect(() => {
    if (consentStatus !== 'undecided') return;
    const timer = setTimeout(() => setDelayElapsed(true), DELAY_MS);
    return () => clearTimeout(timer);
  }, [consentStatus]);

  const visible = consentStatus === 'undecided' && delayElapsed;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 24, opacity: 0 }}
          transition={{ duration: DUR.base, ease: EASE }}
          role="region"
          aria-label={t.cookieConsent.title}
          className="fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom))] left-5 z-50 w-[calc(100%-2.5rem)] max-w-sm"
        >
          <div className="rounded-2xl border border-rule bg-paper p-5 shadow-[0_16px_40px_-12px_rgba(22,24,29,0.22)]">
            <div className="flex items-start justify-between gap-4">
              <p className="text-[13px] font-semibold text-ink">{t.cookieConsent.title}</p>
              <button
                type="button"
                onClick={declineCookies}
                aria-label={t.cookieConsent.closeAria}
                className="-mr-1 -mt-1 rounded-full p-1 text-muted transition-colors hover:text-ink"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <p className="mt-2 text-[14px] leading-[1.55] text-body">{t.cookieConsent.text}</p>
            <div className="mt-4 flex gap-2">
              <button type="button" onClick={acceptCookies} className="btn btn-primary btn-sm">
                {t.cookieConsent.accept}
              </button>
              <button type="button" onClick={declineCookies} className="btn btn-secondary btn-sm">
                {t.cookieConsent.decline}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
