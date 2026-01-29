'use client';

import { Shield, Lock, Server } from 'lucide-react';
import { useLanguage } from './LanguageContext';

export function Security() {
  const { t } = useLanguage();

  return (
    <div id="security" className="py-24 bg-slate-50 relative overflow-hidden">
      {/* Technical Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-3 gap-8">
            {/* Encryption Card - Strong, Metallic Feel */}
            <div className="group relative flex flex-col items-center text-center p-8 rounded-xl bg-white border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-t-xl" />
                
                <div className="mb-6 relative">
                    <div className="absolute inset-0 bg-blue-100 rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative p-4 bg-slate-100 rounded-2xl border border-slate-200 group-hover:border-blue-200 group-hover:bg-blue-50 transition-colors duration-300">
                        <Lock className="w-8 h-8 text-slate-700 group-hover:text-blue-700 transition-colors" />
                    </div>
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">{t.security.encryption.title}</h3>
                <p className="text-slate-600 leading-relaxed font-medium">{t.security.encryption.desc}</p>
            </div>

            {/* AI Privacy Card */}
            <div className="group relative flex flex-col items-center text-center p-8 rounded-xl bg-white border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-t-xl" />
                
                <div className="mb-6 relative">
                    <div className="absolute inset-0 bg-indigo-100 rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative p-4 bg-slate-100 rounded-2xl border border-slate-200 group-hover:border-indigo-200 group-hover:bg-indigo-50 transition-colors duration-300">
                        <Shield className="w-8 h-8 text-slate-700 group-hover:text-indigo-700 transition-colors" />
                    </div>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">{t.security.ai.title}</h3>
                <p className="text-slate-600 leading-relaxed font-medium">{t.security.ai.desc}</p>
            </div>

            {/* Hosting Card */}
            <div className="group relative flex flex-col items-center text-center p-8 rounded-xl bg-white border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-t-xl" />
                
                <div className="mb-6 relative">
                    <div className="absolute inset-0 bg-emerald-100 rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative p-4 bg-slate-100 rounded-2xl border border-slate-200 group-hover:border-emerald-200 group-hover:bg-emerald-50 transition-colors duration-300">
                        <Server className="w-8 h-8 text-slate-700 group-hover:text-emerald-700 transition-colors" />
                    </div>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">{t.security.hosting.title}</h3>
                <p className="text-slate-600 leading-relaxed font-medium">{t.security.hosting.desc}</p>
            </div>
        </div>
      </div>
    </div>
  );
}
