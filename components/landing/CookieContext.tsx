'use client';

import React, { createContext, useCallback, useContext, useSyncExternalStore } from 'react';

type ConsentStatus = 'undecided' | 'accepted' | 'declined';

interface CookieContextType {
  consentStatus: ConsentStatus;
  acceptCookies: () => void;
  declineCookies: () => void;
}

const STORAGE_KEY = 'cookie-consent';

// The decision lives in localStorage; this store lets React read it without a
// setState-in-effect round trip, and keeps two tabs in step through the
// storage event. localStorage can throw (private mode, blocked site data), so
// every access is guarded and the page treats a failure as no decision yet.
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener('storage', listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', listener);
  };
}

function readConsent(): ConsentStatus {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'true') return 'accepted';
    if (stored === 'false' || stored === 'declined') return 'declined';
  } catch {
    // Treated as undecided.
  }
  return 'undecided';
}

function writeConsent(value: 'true' | 'declined') {
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // Nothing to persist to; the banner will show again next visit.
  }
  listeners.forEach((listener) => listener());
}

const serverSnapshot = (): ConsentStatus => 'undecided';

const CookieContext = createContext<CookieContextType | undefined>(undefined);

export function CookieProvider({ children }: { children: React.ReactNode }) {
  const consentStatus = useSyncExternalStore(subscribe, readConsent, serverSnapshot);

  const acceptCookies = useCallback(() => {
    writeConsent('true');
    // Optional analytics scripts would be initialized here once they exist.
  }, []);

  const declineCookies = useCallback(() => {
    writeConsent('declined');
  }, []);

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
