import { useState, useEffect, useRef } from 'react';
import { translateText } from '@/app/actions';

export type Side = 'left' | 'right' | null;

export type Language = 'es' | 'en' | 'de' | 'fr' | 'it' | 'pt'; // Scalable list

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
  const [leftContent, setLeftContent] = useState<string>('<p>The contract starts here...</p>');
  const [rightContent, setRightContent] = useState<string>('<p>Der Vertrag beginnt hier...</p>');
  const [isTranslating, setIsTranslating] = useState(false);
  const [lastEditedSide, setLastEditedSide] = useState<Side>(null);

  // Debounce ref (shared between sides to ensure only one active translation timer)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Request counter to handle race conditions (ignore old responses)
  const requestCounter = useRef(0);

  const handleLeftChange = (content: string) => {
    setLeftContent(content);
    setLastEditedSide('left');
  };

  const handleRightChange = (content: string) => {
    setRightContent(content);
    setLastEditedSide('right');
  };

  // Effect for Left -> Right translation
  useEffect(() => {
    // Only trigger if the user was the last one to edit the LEFT side
    if (lastEditedSide === 'left') {
      const currentRequestId = ++requestCounter.current;

      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(async () => {
        setIsTranslating(true);
        try {
          const translated = await translateText(leftContent, initialRightLang, initialLeftLang);
          // Only update if this is still the latest request
          if (currentRequestId === requestCounter.current) {
            setRightContent(translated); 
          }
        } catch (error) {
          console.error("Translation failed", error);
        } finally {
          // Only update loading state if this is still the latest request
          if (currentRequestId === requestCounter.current) {
            setIsTranslating(false);
          }
        }
      }, 2500); 
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [leftContent, lastEditedSide, initialRightLang, initialLeftLang]); // NOTE: rightContent is NOT a dependency here to avoid loops

  // Effect for Right -> Left translation
  useEffect(() => {
    // Only trigger if the user was the last one to edit the RIGHT side
    if (lastEditedSide === 'right') {
      const currentRequestId = ++requestCounter.current;

      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(async () => {
        setIsTranslating(true);
        try {
          const translated = await translateText(rightContent, initialLeftLang, initialRightLang);
          // Only update if this is still the latest request
          if (currentRequestId === requestCounter.current) {
            setLeftContent(translated);
          }
        } catch (error) {
          console.error("Translation failed", error);
        } finally {
          // Only update loading state if this is still the latest request
          if (currentRequestId === requestCounter.current) {
            setIsTranslating(false);
          }
        }
      }, 2500);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [rightContent, lastEditedSide, initialLeftLang, initialRightLang]); // NOTE: leftContent is NOT a dependency here to avoid loops

  return {
    leftContent,
    rightContent,
    handleLeftChange,
    handleRightChange,
    isTranslating,
  };
};
