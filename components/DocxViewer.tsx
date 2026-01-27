import { renderAsync } from 'docx-preview';
import { useEffect, useRef } from 'react';

interface DocxViewerProps {
  file: File;
  className?: string;
}

export function DocxViewer({ file, className }: DocxViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && file) {
      const bufferPromise = file.arrayBuffer();
      bufferPromise.then((buffer) => {
        if (containerRef.current) {
            containerRef.current.innerHTML = ''; // Clear previous content
            renderAsync(buffer, containerRef.current, containerRef.current, {
                inWrapper: true,
                ignoreWidth: false,
                ignoreHeight: false,
                ignoreFonts: false,
                breakPages: true,
                ignoreLastRenderedPageBreak: true,
                experimental: false,
                trimXmlDeclaration: true,
                useBase64URL: false,
                debug: false,
            });
        }
      });
    }
  }, [file]);

  return (
    <div 
        ref={containerRef} 
        className={`docx-viewer bg-white overflow-auto ${className || ''}`}
        style={{ minHeight: '500px' }}
    />
  );
}
