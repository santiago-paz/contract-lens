import React from 'react';
import { Cpu } from 'lucide-react';

export const EmptyState = () => (
  <div className="h-full flex flex-col items-center justify-center text-gray-500 select-none">
    <div className="border-4 border-gray-200 p-8 rounded-full mb-6">
      <Cpu className="w-24 h-24" />
    </div>
    <p className="uppercase font-black tracking-widest text-xl">System Ready</p>
    <p className="font-mono text-sm mt-2">Waiting for input stream...</p>
  </div>
);

export const LoadingState = () => (
  <div className="h-full flex flex-col items-center justify-center text-black">
    <div className="w-24 h-24 border-8 border-gray-200 border-t-black rounded-full animate-spin mb-8"></div>
    <p className="uppercase font-black tracking-widest text-xl animate-pulse">Processing Contract</p>
    <div className="mt-4 font-mono text-xs bg-[#CCFF00] px-2 py-1 border border-black shadow-hard-sm">
      ROUTER_CLASSIFICATION_IN_PROGRESS...
    </div>
  </div>
);
