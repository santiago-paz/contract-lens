import { useEffect, useState } from 'react';

interface PdfViewerProps {
  file: File;
  className?: string;
}

export function PdfViewer({ file, className }: PdfViewerProps) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setUrl(objectUrl);
      
      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    }
  }, [file]);

  if (!url) return null;

  return (
    <iframe 
      src={url} 
      className={`w-full h-full border-none ${className || ''}`}
      title="PDF Viewer"
    />
  );
}
