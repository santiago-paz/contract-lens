import { ACCEPTED_EXTENSIONS } from '@/lib/file-config';
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
    <div className="w-full max-w-6xl mx-auto animate-fade-in font-mono">
      <div className="mb-8">
        <h2 className="text-2xl font-black text-black flex items-center gap-3 uppercase tracking-tighter">
          <div className="p-2 bg-black text-[#CCFF00] border-2 border-black">
            <FileText className="w-6 h-6" />
          </div>
          Initialize Contract
        </h2>
        <p className="text-gray-600 mt-2 max-w-xl uppercase text-xs font-bold tracking-wide">
          Select contract source // Main Document or Framework Agreement
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Main Document Upload */}
        <div className="border-2 border-dashed border-black bg-white p-12 flex flex-col items-center justify-center text-center hover:bg-[#CCFF00]/10 transition-colors relative group">
          <input 
            type="file" 
            ref={fileInputRef}
            className="hidden" 
            onChange={handleFileChange}
            accept={ACCEPTED_EXTENSIONS}
          />
          
          <div className="absolute top-0 right-0 border-l-2 border-b-2 border-black bg-black text-[#CCFF00] text-xs font-bold px-3 py-1 uppercase">Step 01</div>
          
          <div className="w-48 h-48 mb-6 relative flex items-center justify-center">
             <div className="w-32 h-32 border-2 border-black flex items-center justify-center bg-white group-hover:shadow-hard transition-all">
                <Upload className="w-12 h-12 text-black" />
             </div>
          </div>
          
          <h3 className="text-xl font-bold text-black mb-2 uppercase">Main Document</h3>
          <p className="text-gray-600 text-xs mb-8 max-w-xs uppercase leading-relaxed">
            Upload or Drag & Drop (MAX. 100 MB)<br/>
            Target formats: PDF, DOCX
          </p>
          
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="px-6 py-4 bg-black text-[#CCFF00] font-bold text-sm uppercase rounded-none border-2 border-black shadow-hard hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none hover:bg-[#CCFF00] hover:text-black transition-all flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Upload File
          </button>
        </div>

        {/* Attachments Upload - Visual only for now */}
        <div className="border-2 border-dashed border-gray-300 bg-gray-50 p-12 flex flex-col items-center justify-center text-center opacity-75">
           <div className="w-48 h-48 mb-6 relative flex items-center justify-center">
             <div className="w-32 h-32 border-2 border-dashed border-gray-300 flex items-center justify-center bg-white">
                <File className="w-12 h-12 text-gray-300" />
             </div>
          </div>
          
          <h3 className="text-xl font-bold text-gray-400 mb-2 uppercase">Attachments</h3>
          <p className="text-gray-400 text-xs mb-8 max-w-xs uppercase">
            Upload supplemental files<br/>(Coming Soon)
          </p>
          
          <button disabled className="px-6 py-4 bg-white border-2 border-gray-200 text-gray-300 font-bold text-sm uppercase rounded-none cursor-not-allowed flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Upload File
          </button>
        </div>
      </div>
      
    </div>
  );
}
