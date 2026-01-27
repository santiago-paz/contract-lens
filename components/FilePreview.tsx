import { getFileType } from '@/lib/file-config';
import { DocxViewer } from './DocxViewer';
import { PdfViewer } from './PdfViewer';
import { FileText } from 'lucide-react';

interface FilePreviewProps {
  file: File;
  className?: string;
}

export function FilePreview({ file, className }: FilePreviewProps) {
  const type = getFileType(file);

  if (type === 'docx') {
    return <DocxViewer file={file} className={className} />;
  }

  if (type === 'pdf') {
    return <PdfViewer file={file} className={className} />;
  }

  return (
    <div className={`flex flex-col items-center justify-center h-full bg-gray-50 text-gray-400 ${className || ''}`}>
      <FileText className="w-16 h-16 mb-4 opacity-50" />
      <p>Preview not available for this file type</p>
      <p className="text-sm mt-2">{file.name}</p>
    </div>
  );
}
