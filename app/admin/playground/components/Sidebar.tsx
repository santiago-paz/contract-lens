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
    <div className="w-96 bg-white border-r-2 border-black flex flex-col h-screen sticky top-0 z-10 shadow-hard-lg">
      <div className="p-4 border-b-2 border-black bg-black text-white">
        <h1 className="font-black text-xl flex items-center gap-2 uppercase tracking-tighter">
          <Terminal className="w-5 h-5 text-[#CCFF00]" />
          Playground <span className="text-[#CCFF00] text-xs self-end mb-1">v2.0</span>
        </h1>
        <p className="text-[10px] text-gray-600 mt-1 font-bold uppercase tracking-widest">Router + Expert Architecture</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* File Input */}
        <div className="space-y-3">
          <label className="text-xs font-black uppercase tracking-wider bg-[#CCFF00] text-black px-2 py-1 border border-black inline-block shadow-hard-sm">Input Document</label>
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed border-black p-8 text-center cursor-pointer transition-all group relative overflow-hidden
              ${file ? 'bg-[#CCFF00]/10' : 'bg-white hover:bg-gray-50'}`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={onFileChange}
              className="hidden"
              accept=".pdf,.docx"
            />
            <div className="relative z-10">
              <Upload className={`w-8 h-8 mx-auto mb-3 transition-transform group-hover:-translate-y-1 ${file ? 'text-black' : 'text-gray-600'}`} />
              {file ? (
                <div className="font-bold text-black border-b-2 border-black inline-block pb-1 line-clamp-1">{file.name}</div>
              ) : (
                <div className="text-xs font-bold text-black uppercase tracking-wide line-clamp-1">Drop PDF/DOCX here</div>
              )}
            </div>
          </div>
        </div>

        {/* Model Settings */}
        <div className="space-y-6">
          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-wider bg-black text-white px-2 py-1 inline-block shadow-hard-sm">Expert Model</label>
            <div className="relative">
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full p-3 border-2 border-black bg-white text-xs font-bold text-black appearance-none rounded-none shadow-hard-sm focus:shadow-hard transition-all focus:outline-none cursor-pointer"
              >
                <option value="deepseek/deepseek-r1">deepseek/deepseek-r1</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-black"></div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-wider flex justify-between items-center">
              <span className="bg-black text-white px-2 py-1 shadow-hard-sm">Temperature</span>
              <span className="font-mono font-bold text-lg border-b-2 border-[#CCFF00]">{temperature}</span>
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-none appearance-none border border-black cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#CCFF00] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-black [&::-webkit-slider-thumb]:shadow-hard-sm"
            />
          </div>
        </div>

        {/* System Prompt */}
        <div className="space-y-3 flex-1 flex flex-col">
          <label className="text-xs font-black uppercase tracking-wider bg-black text-white px-2 py-1 inline-block shadow-hard-sm w-max">System Prompt</label>
          <textarea
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            placeholder="OVERRIDE EXPERT PROMPT..."
            className="w-full flex-1 min-h-[150px] p-4 border-2 border-black bg-white text-xs text-black resize-none focus:outline-none shadow-hard-sm focus:shadow-hard transition-all placeholder:text-gray-500 font-mono"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="p-6 border-t-2 border-black bg-white space-y-3">
        <button
          onClick={onExecute}
          disabled={!file || isLoading}
          className={`w-full py-4 px-4 font-black uppercase tracking-wider flex items-center justify-center gap-3 transition-all border-2 border-black shadow-hard
            ${!file || isLoading
              ? 'bg-gray-100 text-gray-600 cursor-not-allowed shadow-none border-gray-300'
              : 'bg-black text-[#CCFF00] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none active:bg-[#CCFF00] active:text-black'
            }`}
        >
          {isLoading ? <Clock className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5 fill-current" />}
          {isLoading ? 'Processing...' : 'Run Analysis'}
        </button>
      </div>
    </div>
  );
};
