'use client';

import { Shield, Lock, Server } from 'lucide-react';
import { useLanguage } from './LanguageContext';

export function Security() {
  const { t } = useLanguage();

  return (
    <div id="security" className="py-24 bg-white relative overflow-hidden border-b-2 border-black">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-100 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white mb-6">
                <Shield className="w-4 h-4" />
                <span className="text-sm font-bold font-mono uppercase">Defense Protocol</span>
            </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
            {/* Encryption Card */}
            <div className="group relative flex flex-col items-center text-center p-8 bg-white border-2 border-black shadow-hard hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-200">
                <div className="w-full h-2 bg-black absolute top-0 left-0"></div>
                
                <div className="mb-6 relative">
                    <div className="w-16 h-16 bg-[#CCFF00] border-2 border-black flex items-center justify-center">
                        <Lock className="w-8 h-8 text-black" />
                    </div>
                </div>
                
                <h3 className="text-xl font-bold font-mono text-black mb-3 uppercase tracking-wide">{t.security.encryption.title}</h3>
                <p className="text-black font-mono text-sm leading-relaxed uppercase">{t.security.encryption.desc}</p>
            </div>

            {/* AI Privacy Card */}
            <div className="group relative flex flex-col items-center text-center p-8 bg-white border-2 border-black shadow-hard hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-200">
                <div className="w-full h-2 bg-black absolute top-0 left-0"></div>
                
                <div className="mb-6 relative">
                    <div className="w-16 h-16 bg-black border-2 border-black flex items-center justify-center">
                        <Shield className="w-8 h-8 text-white" />
                    </div>
                </div>

                <h3 className="text-xl font-bold font-mono text-black mb-3 uppercase tracking-wide">{t.security.ai.title}</h3>
                <p className="text-black font-mono text-sm leading-relaxed uppercase">{t.security.ai.desc}</p>
            </div>

            {/* Hosting Card */}
            <div className="group relative flex flex-col items-center text-center p-8 bg-white border-2 border-black shadow-hard hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-200">
                <div className="w-full h-2 bg-black absolute top-0 left-0"></div>
                
                <div className="mb-6 relative">
                    <div className="w-16 h-16 bg-white border-2 border-black flex items-center justify-center">
                        <Server className="w-8 h-8 text-black" />
                    </div>
                </div>

                <h3 className="text-xl font-bold font-mono text-black mb-3 uppercase tracking-wide">{t.security.hosting.title}</h3>
                <p className="text-black font-mono text-sm leading-relaxed uppercase">{t.security.hosting.desc}</p>
            </div>
        </div>
      </div>
    </div>
  );
}
