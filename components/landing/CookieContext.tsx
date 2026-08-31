'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type ConsentStatus = 'undecided' | 'accepted' | 'declined';

interface CookieContextType {
  consentStatus: ConsentStatus;
  acceptCookies: () => void;
  declineCookies: () => void;
}

const CookieContext = createContext<CookieContextType | undefined>(undefined);

export function CookieProvider({ children }: { children: React.ReactNode }) {
  const [consentStatus, setConsentStatus] = useState<ConsentStatus>('undecided');

  useEffect(() => {
    const storedConsent = localStorage.getItem('cookie-consent');
    if (storedConsent === 'true') {
      setConsentStatus('accepted');
    } else if (storedConsent === 'false' || storedConsent === 'declined') {
      setConsentStatus('declined');
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'true');
    setConsentStatus('accepted');
    // Optional analytics scripts would be initialized here once they exist.
  };

  const declineCookies = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setConsentStatus('declined');
  };

  return (
    <CookieContext.Provider value={{ consentStatus, acceptCookies, declineCookies }}>
      {children}
    </CookieContext.Provider>
  );
}

export function useCookieConsent() {
  const context = useContext(CookieContext);
  if (context === undefined) {
    throw new Error('useCookieConsent must be used within a CookieProvider');
  }
  return context;
}
