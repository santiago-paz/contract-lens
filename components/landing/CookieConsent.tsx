'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { useCookieConsent } from './CookieContext';

export function CookieConsent() {
  const { t } = useLanguage();
  const { consentStatus, acceptCookies, declineCookies } = useCookieConsent();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (consentStatus === 'undecided') {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [consentStatus]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed bottom-4 right-4 z-50 max-w-sm w-[calc(100%-2rem)]"
        >
          <div className="bg-white border-2 border-black shadow-hard p-4 flex flex-col gap-4">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b-2 border-black pb-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#CCFF00] border border-black animate-pulse"></div>
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-black">
                  SYSTEM_ALERT
                </span>
              </div>
              <button 
                onClick={declineCookies}
                className="hover:bg-black hover:text-[#CCFF00] transition-colors p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="flex gap-4">
              <div className="shrink-0 pt-1">
                <Cookie className="w-8 h-8 text-black" />
              </div>
              <div>
                <p className="font-mono text-sm text-black leading-tight">
                  {t.cookieConsent.text}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={acceptCookies}
                className="flex-1 bg-black text-[#CCFF00] border-2 border-black font-mono text-xs font-bold uppercase py-2 px-4 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all active:bg-[#CCFF00] active:text-black"
              >
                {t.cookieConsent.accept}
              </button>
              <button
                onClick={declineCookies}
                className="flex-1 bg-white text-black border-2 border-black font-mono text-xs font-bold uppercase py-2 px-4 hover:bg-gray-50 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                {t.cookieConsent.decline}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
