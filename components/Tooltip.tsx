import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

export function Tooltip({ content, children }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMouseEnter = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.top - 8, // 8px spacing above
        left: rect.left + rect.width / 2
      });
      setIsVisible(true);
    }
  };

  return (
    <>
      <div 
        ref={triggerRef}
        className="relative inline-flex items-center"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      {mounted && isVisible && createPortal(
        <div 
          className="fixed z-[9999] px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded-md shadow-lg transform -translate-x-1/2 -translate-y-full pointer-events-none animate-fade-in"
          style={{ top: position.top, left: position.left }}
        >
          {content}
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
        </div>,
        document.body
      )}
    </>
  );
}
