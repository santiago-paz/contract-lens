import { useState } from 'react';

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
}

export const useTranslationSync = ({ 
  initialLeftLang = 'en', 
  initialRightLang = 'de' 
}: UseTranslationSyncProps = {}): UseTranslationSyncReturn => {
  const [leftContent, setLeftContent] = useState<string>('');
  const [rightContent, setRightContent] = useState<string>('');

  const handleLeftChange = (content: string) => {
    setLeftContent(content);
  };

  const handleRightChange = (content: string) => {
    setRightContent(content);
  };

  return {
    leftContent,
    rightContent,
    handleLeftChange,
    handleRightChange,
  };
};
