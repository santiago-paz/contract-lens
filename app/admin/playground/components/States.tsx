import React from 'react';
import { Cpu } from 'lucide-react';

export const EmptyState = () => (
  <div className="h-full flex flex-col items-center justify-center text-gray-400 select-none">
    <div className="border border-gray-200 p-8 rounded-full mb-6">
      <Cpu className="w-20 h-20 text-gray-300" />
    </div>
    <p className="uppercase font-bold tracking-widest text-sm text-gray-400">System Ready</p>
    <p className="font-mono text-xs mt-2 text-gray-300">Waiting for input stream...</p>
  </div>
);

export const LoadingState = () => (
  <div className="h-full flex flex-col items-center justify-center text-black">
    <div className="w-20 h-20 border-4 border-gray-200 border-t-black rounded-full animate-spin mb-8"></div>
    <p className="uppercase font-bold tracking-widest text-sm animate-pulse">Processing Contract</p>
    <div className="mt-4 font-mono text-[10px] text-gray-400 uppercase">
      Router classification in progress...
    </div>
  </div>
);
