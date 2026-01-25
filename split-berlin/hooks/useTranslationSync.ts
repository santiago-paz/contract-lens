import { useState, useEffect, useRef } from 'react';
import { translateText } from '@/app/actions';

export type Side = 'left' | 'right' | null;

export type Language = 'es' | 'en' | 'de' | 'fr' | 'it' | 'pt';

interface UseTranslationSyncProps {
  initialLeftLang?: Language;
  initialRightLang?: Language;
}

interface UseTranslationSyncReturn {
  leftContent: string;
  rightContent: string;
  handleLeftChange: (content: string) => void;
  handleRightChange: (content: string) => void;
  isTranslating: boolean;
}

export const useTranslationSync = ({ 
  initialLeftLang = 'en', 
  initialRightLang = 'de' 
}: UseTranslationSyncProps = {}): UseTranslationSyncReturn => {
  const [leftContent, setLeftContent] = useState<string>('');
  const [rightContent, setRightContent] = useState<string>('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [lastEditedSide, setLastEditedSide] = useState<Side>(null);

  // Debounce ref
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const requestCounter = useRef(0);

  const handleLeftChange = (content: string) => {
    setLeftContent(content);
    setLastEditedSide('left');
  };

  const handleRightChange = (content: string) => {
    setRightContent(content);
    setLastEditedSide('right');
  };

  // --------------------------------------------------------------------------
  // Left -> Right Synchronization
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (lastEditedSide === 'left') {
      const currentRequestId = ++requestCounter.current;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      // If content is empty, clear the other side immediately without API call
      if (!leftContent.trim()) {
        setRightContent('');
        return;
      }

      timeoutRef.current = setTimeout(async () => {
        setIsTranslating(true);
        try {
          const translated = await translateText(leftContent, initialRightLang, initialLeftLang);
          
          if (currentRequestId === requestCounter.current) {
            setRightContent(translated);
          }
        } catch (error) {
          console.error("Translation error", error);
        } finally {
          if (currentRequestId === requestCounter.current) setIsTranslating(false);
        }
      }, 1000);
    }
  }, [leftContent, lastEditedSide, initialRightLang, initialLeftLang]);

  // --------------------------------------------------------------------------
  // Right -> Left Synchronization
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (lastEditedSide === 'right') {
      const currentRequestId = ++requestCounter.current;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      // If content is empty, clear the other side immediately without API call
      if (!rightContent.trim()) {
        setLeftContent('');
        return;
      }

      timeoutRef.current = setTimeout(async () => {
        setIsTranslating(true);
        try {
          const translated = await translateText(rightContent, initialLeftLang, initialRightLang);
          
          if (currentRequestId === requestCounter.current) {
            setLeftContent(translated);
          }
        } catch (error) {
          console.error("Translation error", error);
        } finally {
          if (currentRequestId === requestCounter.current) setIsTranslating(false);
        }
      }, 1000);
    }
  }, [rightContent, lastEditedSide, initialLeftLang, initialRightLang]);

  return {
    leftContent,
    rightContent,
    handleLeftChange,
    handleRightChange,
    isTranslating,
  };
};
