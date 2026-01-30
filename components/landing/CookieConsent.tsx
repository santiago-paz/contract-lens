'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X, Shield } from 'lucide-react';
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
          className="fixed bottom-6 right-6 z-50 max-w-sm w-[calc(100%-3rem)]"
        >
          <div className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_#000] p-0 flex flex-col relative overflow-hidden bg-noise">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b-2 border-black p-3 bg-black text-white">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#CCFF00] rounded-full animate-pulse"></div>
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#CCFF00]">
                  SYSTEM_ALERT // COOKIE_POLICY
                </span>
              </div>
              <button 
                onClick={declineCookies}
                className="hover:bg-[#CCFF00] hover:text-black transition-colors p-1 border border-transparent hover:border-black"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="flex gap-5 p-5">
              <div className="shrink-0 pt-1">
                <div className="w-10 h-10 border-2 border-black flex items-center justify-center bg-[#CCFF00] shadow-hard-sm">
                    <Shield className="w-6 h-6 text-black" />
                </div>
              </div>
              <div>
                <p className="font-mono text-xs text-black leading-relaxed font-medium uppercase">
                  {t.cookieConsent.text}
                </p>
                <div className="mt-2 text-[10px] font-mono text-gray-500 uppercase">
                    REF: PRIVACY_DIRECTIVE_2024
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex border-t-2 border-black">
              <button
                onClick={declineCookies}
                className="flex-1 bg-white text-black font-mono text-xs font-bold uppercase py-3 px-4 hover:bg-gray-100 transition-colors border-r-2 border-black"
              >
                {t.cookieConsent.decline}
              </button>
              <button
                onClick={acceptCookies}
                className="flex-1 bg-[#CCFF00] text-black font-mono text-xs font-bold uppercase py-3 px-4 hover:bg-black hover:text-[#CCFF00] transition-colors"
              >
                {t.cookieConsent.accept}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
