import { useState, useEffect, useRef } from 'react';

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

// Mock translation function
const mockTranslate = async (text: string, toLang: Language): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Basic text manipulation to simulate translation
      if (!text || text === '<p></p>') return resolve('');
      
      // In a real app, this would call an API with 'toLang'
      const prefix = ''; 
      
      resolve(`${prefix}${text}`);
    }, 1000); 
  });
};

export const useTranslationSync = ({ 
  initialLeftLang = 'en', 
  initialRightLang = 'de' 
}: UseTranslationSyncProps = {}): UseTranslationSyncReturn => {
  const [leftContent, setLeftContent] = useState<string>('<p>The contract starts here...</p>');
  const [rightContent, setRightContent] = useState<string>('<p>Der Vertrag beginnt hier...</p>');
  const [isTranslating, setIsTranslating] = useState(false);
  const [lastEditedSide, setLastEditedSide] = useState<Side>(null);

  // Debounce refs
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleLeftChange = (content: string) => {
    setLeftContent(content);
    setLastEditedSide('left');
  };

  const handleRightChange = (content: string) => {
    setRightContent(content);
    setLastEditedSide('right');
  };

  useEffect(() => {
    // Clear existing timeout on every render (content change)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // If no specific side was edited recently (initial load), do nothing
    if (!lastEditedSide) return;

    // Logic: If Left changed, translate to Right
    if (lastEditedSide === 'left') {
      timeoutRef.current = setTimeout(async () => {
        setIsTranslating(true);
        try {
          const translated = await mockTranslate(leftContent, initialRightLang);
          setRightContent(translated); 
        } catch (error) {
          console.error("Translation failed", error);
        } finally {
          setIsTranslating(false);
        }
      }, 1000); 
    }

    // Logic: If Right changed, translate to Left
    if (lastEditedSide === 'right') {
      timeoutRef.current = setTimeout(async () => {
        setIsTranslating(true);
        try {
          const translated = await mockTranslate(rightContent, initialLeftLang);
          setLeftContent(translated);
        } catch (error) {
          console.error("Translation failed", error);
        } finally {
          setIsTranslating(false);
        }
      }, 1000);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [leftContent, rightContent, lastEditedSide, initialLeftLang, initialRightLang]);

  return {
    leftContent,
    rightContent,
    handleLeftChange,
    handleRightChange,
    isTranslating,
  };
};
