import React, { useRef } from 'react';
import { Terminal, Upload, Clock, Play } from 'lucide-react';

interface SidebarProps {
  file: File | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  systemPrompt: string;
  setSystemPrompt: (value: string) => void;
  model: string;
  setModel: (value: string) => void;
  temperature: number;
  setTemperature: (value: number) => void;
  isLoading: boolean;
  onExecute: () => void;
}

export const Sidebar = ({
  file,
  onFileChange,
  systemPrompt,
  setSystemPrompt,
  model,
  setModel,
  temperature,
  setTemperature,
  isLoading,
  onExecute
}: SidebarProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="w-96 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0 z-10 shadow-sm">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h1 className="font-black text-xl flex items-center gap-2 uppercase tracking-tighter text-black">
          <Terminal className="w-5 h-5 text-gray-500" />
          Playground <span className="text-gray-400 text-xs self-end mb-1">v2.0</span>
        </h1>
        <p className="text-[10px] text-gray-400 mt-1 font-bold uppercase tracking-widest">Router + Expert Architecture</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* File Input */}
        <div className="space-y-3">
          <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Input Document</label>
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`border border-dashed rounded-sm p-8 text-center cursor-pointer transition-all group relative overflow-hidden
              ${file ? 'border-black bg-gray-50' : 'border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50'}`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={onFileChange}
              className="hidden"
              accept=".pdf,.docx"
            />
            <div className="relative z-10">
              <Upload className={`w-8 h-8 mx-auto mb-3 transition-transform group-hover:-translate-y-1 ${file ? 'text-black' : 'text-gray-400'}`} />
              {file ? (
                <div className="font-bold text-black text-xs uppercase line-clamp-1">{file.name}</div>
              ) : (
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wide line-clamp-1">Drop PDF/DOCX here</div>
              )}
            </div>
          </div>
        </div>

        {/* Model Settings */}
        <div className="space-y-6">
          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Expert Model</label>
            <div className="relative">
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full p-3 border border-gray-200 bg-white text-xs font-bold text-black appearance-none rounded-sm focus:border-black focus:outline-none transition-colors cursor-pointer"
              >
                <option value="deepseek/deepseek-r1">deepseek/deepseek-r1</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-gray-400"></div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-wider flex justify-between items-center">
              <span className="text-gray-500">Temperature</span>
              <span className="font-mono font-bold text-lg text-black">{temperature}</span>
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-0"
            />
          </div>
        </div>

        {/* System Prompt */}
        <div className="space-y-3 flex-1 flex flex-col">
          <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">System Prompt</label>
          <textarea
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            placeholder="Override expert prompt..."
            className="w-full flex-1 min-h-[150px] p-4 border border-gray-200 bg-white text-xs text-black resize-none rounded-sm focus:outline-none focus:border-black transition-colors placeholder:text-gray-300 font-mono"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="p-6 border-t border-gray-200 bg-white space-y-3">
        <button
          onClick={onExecute}
          disabled={!file || isLoading}
          className={`w-full py-3 px-4 font-bold uppercase text-sm tracking-wider flex items-center justify-center gap-3 transition-all rounded-sm
            ${!file || isLoading
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
              : 'bg-black text-white border border-black hover:bg-[#00D4FF] hover:text-black active:translate-y-[1px]'
            }`}
        >
          {isLoading ? <Clock className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5 fill-current" />}
          {isLoading ? 'Processing...' : 'Run'}
        </button>
      </div>
    </div>
  );
};
