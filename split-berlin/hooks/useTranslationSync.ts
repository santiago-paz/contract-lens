import { useState, useEffect, useRef } from 'react';
import { translateText } from '@/app/actions';
import { parseHtmlToNodes, serializeNodesToHtml, compareNodes, ContentNode } from '@/utils/node-system';

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

  // Keep track of the last known stable state (NODES, not string) to allow smart diffing
  const prevLeftNodesRef = useRef<ContentNode[]>([]);
  const prevRightNodesRef = useRef<ContentNode[]>([]);
  
  // Initialization effect to populate refs
  useEffect(() => {
    prevLeftNodesRef.current = parseHtmlToNodes(leftContent);
    prevRightNodesRef.current = parseHtmlToNodes(rightContent);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

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

      // Parse current state immediately to detect structural changes that don't need API
      const currentNodes = parseHtmlToNodes(leftContent);
      const oldNodes = prevLeftNodesRef.current;
      const diff = compareNodes(oldNodes, currentNodes);

      // Structural Change (Add/Remove) - Execute IMMEDIATELY without debounce
      if (diff.type === 'STRUCTURAL_ADD') {
        // User added a block (e.g. pressed Enter)
        // Replicate this structure in Right side
        const targetNodes = [...prevRightNodesRef.current]; // Work off previous known state
        
        // Safety: Insert at valid index
        const index = Math.min(diff.index, targetNodes.length);
        
        // Create an empty node of same tag
        const emptyNode: ContentNode = {
            id: `mirror-${Date.now()}`,
            tag: diff.node.tag,
            content: '', // Empty because it's a new line
            text: '',
            attributes: diff.node.attributes
        };
        
        targetNodes.splice(index, 0, emptyNode);
        
        const newHtml = serializeNodesToHtml(targetNodes);
        setRightContent(newHtml);
        
        // Update baselines
        prevLeftNodesRef.current = currentNodes;
        prevRightNodesRef.current = targetNodes;
        return;
      }

      if (diff.type === 'STRUCTURAL_REMOVE') {
         // User deleted a block
         const targetNodes = [...prevRightNodesRef.current];
         
         if (diff.index < targetNodes.length) {
             targetNodes.splice(diff.index, 1);
             const newHtml = serializeNodesToHtml(targetNodes);
             setRightContent(newHtml);
             
             // Update baselines
             prevLeftNodesRef.current = currentNodes;
             prevRightNodesRef.current = targetNodes;
         }
         return;
      }

      // If it's a content update or complex change, we wait for debounce (API call needed)
      timeoutRef.current = setTimeout(async () => {
        setIsTranslating(true);
        try {
            // Re-evaluate nodes inside timeout (in case of rapid typing)
            const debouncedCurrentNodes = parseHtmlToNodes(leftContent);
            const debouncedDiff = compareNodes(prevLeftNodesRef.current, debouncedCurrentNodes);
            
            if (debouncedDiff.type === 'TEXT_UPDATE') {
                const targetNodes = parseHtmlToNodes(rightContent); // Get fresh right state
                
                // Only sync if structure aligns
                if (targetNodes.length === debouncedCurrentNodes.length) {
                    const translatedText = await translateText(
                        debouncedDiff.content, 
                        initialRightLang, 
                        initialLeftLang
                    );

                    if (currentRequestId === requestCounter.current) {
                        targetNodes[debouncedDiff.index].content = translatedText;
                        const newHtml = serializeNodesToHtml(targetNodes);
                        setRightContent(newHtml);
                        
                        prevLeftNodesRef.current = debouncedCurrentNodes;
                        prevRightNodesRef.current = targetNodes;
                    }
                    return;
                }
            }

            // Fallback: Full Translation
            // Used for complex edits or if sync got lost
            const translated = await translateText(leftContent, initialRightLang, initialLeftLang);
            if (currentRequestId === requestCounter.current) {
                setRightContent(translated);
                prevLeftNodesRef.current = debouncedCurrentNodes;
                prevRightNodesRef.current = parseHtmlToNodes(translated);
            }

        } catch (error) {
            console.error("Translation error", error);
        } finally {
            if (currentRequestId === requestCounter.current) setIsTranslating(false);
        }
      }, 1000); // Shorter debounce for text is fine now that structure is instant
    }
  }, [leftContent, lastEditedSide, initialRightLang, initialLeftLang, rightContent]); // Added rightContent for fallback safety

  // --------------------------------------------------------------------------
  // Right -> Left Synchronization
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (lastEditedSide === 'right') {
      const currentRequestId = ++requestCounter.current;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      const currentNodes = parseHtmlToNodes(rightContent);
      const oldNodes = prevRightNodesRef.current;
      const diff = compareNodes(oldNodes, currentNodes);

      if (diff.type === 'STRUCTURAL_ADD') {
        const targetNodes = [...prevLeftNodesRef.current];
        const index = Math.min(diff.index, targetNodes.length);
        const emptyNode: ContentNode = {
            id: `mirror-${Date.now()}`,
            tag: diff.node.tag,
            content: '',
            text: '',
            attributes: diff.node.attributes
        };
        targetNodes.splice(index, 0, emptyNode);
        const newHtml = serializeNodesToHtml(targetNodes);
        setLeftContent(newHtml);
        prevRightNodesRef.current = currentNodes;
        prevLeftNodesRef.current = targetNodes;
        return;
      }

      if (diff.type === 'STRUCTURAL_REMOVE') {
         const targetNodes = [...prevLeftNodesRef.current];
         if (diff.index < targetNodes.length) {
             targetNodes.splice(diff.index, 1);
             const newHtml = serializeNodesToHtml(targetNodes);
             setLeftContent(newHtml);
             prevRightNodesRef.current = currentNodes;
             prevLeftNodesRef.current = targetNodes;
         }
         return;
      }

      timeoutRef.current = setTimeout(async () => {
        setIsTranslating(true);
        try {
            const debouncedCurrentNodes = parseHtmlToNodes(rightContent);
            const debouncedDiff = compareNodes(prevRightNodesRef.current, debouncedCurrentNodes);
            
            if (debouncedDiff.type === 'TEXT_UPDATE') {
                const targetNodes = parseHtmlToNodes(leftContent);
                
                if (targetNodes.length === debouncedCurrentNodes.length) {
                    const translatedText = await translateText(
                        debouncedDiff.content, 
                        initialLeftLang, 
                        initialRightLang
                    );

                    if (currentRequestId === requestCounter.current) {
                        targetNodes[debouncedDiff.index].content = translatedText;
                        const newHtml = serializeNodesToHtml(targetNodes);
                        setLeftContent(newHtml);
                        prevRightNodesRef.current = debouncedCurrentNodes;
                        prevLeftNodesRef.current = targetNodes;
                    }
                    return;
                }
            }

            const translated = await translateText(rightContent, initialLeftLang, initialRightLang);
            if (currentRequestId === requestCounter.current) {
                setLeftContent(translated);
                prevRightNodesRef.current = debouncedCurrentNodes;
                prevLeftNodesRef.current = parseHtmlToNodes(translated);
            }
        } catch (error) {
            console.error("Translation error", error);
        } finally {
            if (currentRequestId === requestCounter.current) setIsTranslating(false);
        }
      }, 1000);
    }
  }, [rightContent, lastEditedSide, initialLeftLang, initialRightLang, leftContent]);

  return {
    leftContent,
    rightContent,
    handleLeftChange,
    handleRightChange,
    isTranslating,
  };
};
