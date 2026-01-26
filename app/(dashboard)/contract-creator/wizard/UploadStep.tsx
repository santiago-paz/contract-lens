import { Upload, FileText, File } from 'lucide-react';
import { useRef } from 'react';

interface UploadStepProps {
  onFileSelect: (file: File) => void;
}

export function UploadStep({ onFileSelect }: UploadStepProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
          New Contract
        </h2>
        <p className="text-gray-500 mt-2 max-w-xl">
          When creating a new contract, choose between a single contract or a framework agreement.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Main Document Upload */}
        <div className="border-2 border-dashed border-blue-200 rounded-2xl p-12 flex flex-col items-center justify-center text-center bg-blue-50/30 hover:bg-blue-50/50 transition-colors relative group">
          <input 
            type="file" 
            ref={fileInputRef}
            className="hidden" 
            onChange={handleFileChange}
            accept=".pdf,.docx,.doc"
          />
          
          <div className="absolute top-4 right-4 text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">Step 1</div>
          
          <div className="w-48 h-48 mb-6 relative">
             {/* Abstract illustration placeholder using standard shapes/icons since we can't use the exact SVG from screenshot */}
             <div className="absolute inset-0 bg-blue-100 rounded-full opacity-20 animate-pulse"></div>
             <div className="absolute inset-0 flex items-center justify-center">
                <Upload className="w-16 h-16 text-blue-500" />
             </div>
          </div>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Main Contract Document</h3>
          <p className="text-gray-500 text-sm mb-8 max-w-xs">
            Upload or Drag & Drop (max. 100 MB)<br/>
            We automatically extract contract data from PDF and DOCX files.
          </p>
          
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Select & Upload
          </button>
        </div>

        {/* Attachments Upload - Visual only for now */}
        <div className="border-2 border-dashed border-gray-200 rounded-2xl p-12 flex flex-col items-center justify-center text-center bg-gray-50/30 hover:bg-gray-50/50 transition-colors opacity-75">
           <div className="w-48 h-48 mb-6 relative flex items-center justify-center">
             <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center">
                <File className="w-12 h-12 text-gray-400" />
             </div>
          </div>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Attachments</h3>
          <p className="text-gray-500 text-sm mb-8 max-w-xs">
            Upload any file or drag & drop (max. 100 MB)
          </p>
          
          <button className="px-6 py-3 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all flex items-center gap-2 cursor-not-allowed">
            <Upload className="w-4 h-4" />
            Select & Upload
          </button>
        </div>
      </div>
      
      <div className="mt-12 pt-8 border-t border-gray-100 flex justify-center text-sm text-gray-400">
        Or choose yourself
      </div>
    </div>
  );
}
