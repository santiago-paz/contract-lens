'use client';

import Link from 'next/link';
import { ArrowRight, Globe } from 'lucide-react';
import { useLanguage } from './LanguageContext';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-white border-t-2 border-black bg-noise relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="relative bg-black text-white p-12 sm:p-24 text-center mb-24 shadow-[16px_16px_0px_0px_#CCFF00] overflow-hidden border-2 border-black group hover:shadow-[20px_20px_0px_0px_#CCFF00] hover:-translate-y-1 transition-all duration-300">
             {/* Abstract Pattern */}
             <div className="absolute inset-0 opacity-20 bg-[linear-gradient(45deg,#CCFF00_1px,transparent_1px),linear-gradient(-45deg,#CCFF00_1px,transparent_1px)] [background-size:30px_30px] group-hover:opacity-30 transition-opacity"></div>
             
             <div className="relative z-10">
                <h2 className="text-5xl sm:text-7xl lg:text-8xl font-black text-white mb-12 uppercase tracking-tighter leading-none">
                    {t.footer.ctaTitle}
                </h2>
                <div className="mt-8 flex justify-center">
                    <button
                      onClick={() => {
                        const contactForm = document.getElementById('contact-form');
                        contactForm?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="group inline-flex items-center justify-center px-12 py-6 text-xl font-bold font-mono uppercase bg-[#CCFF00] text-black border-2 border-white hover:bg-white hover:text-black hover:border-black transition-all shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
                    >
                      {t.footer.ctaButton}
                      <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform stroke-[3]" />
                    </button>
                </div>
             </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 border-t-4 border-black pt-12">
            <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3">
                    <div className="bg-black text-[#CCFF00] w-16 h-16 border-2 border-black flex items-center justify-center shadow-hard-sm hover:rotate-6 transition-transform">
                        <div className="font-mono font-black text-3xl leading-none">S</div>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-4xl font-black font-mono uppercase text-black tracking-tighter leading-none">Split</span>
                        <span className="text-4xl font-black font-mono uppercase text-black tracking-tighter leading-none">Berlin</span>
                    </div>
                </div>
                <div className="text-sm font-mono text-black max-w-xs leading-relaxed font-bold uppercase">
                    {t.footer.systemDesc}
                </div>
                <div className="flex flex-wrap gap-2 sm:gap-4 -ml-4">
                    <a href="#" className="font-mono text-sm uppercase font-bold text-black border-2 border-transparent hover:border-black hover:bg-[#CCFF00] px-4 py-2 transition-all">{t.footer.privacy}</a>
                    <a href="#" className="font-mono text-sm uppercase font-bold text-black border-2 border-transparent hover:border-black hover:bg-[#CCFF00] px-4 py-2 transition-all">{t.footer.terms}</a>
                    <a href="#" className="font-mono text-sm uppercase font-bold text-black border-2 border-transparent hover:border-black hover:bg-[#CCFF00] px-4 py-2 transition-all">Twitter</a>
                    <a href="#" className="font-mono text-sm uppercase font-bold text-black border-2 border-transparent hover:border-black hover:bg-[#CCFF00] px-4 py-2 transition-all">LinkedIn</a>
                </div>
            </div>
            
            <div className="flex flex-col items-start md:items-end gap-6 w-full md:w-auto">
                <div className="text-xs font-mono text-gray-500 uppercase tracking-widest">
                    © {new Date().getFullYear()} {t.footer.copyright}
                </div>
            </div>
        </div>
      </div>
      
      {/* Bottom Bar Decoration */}
      <div className="h-4 bg-[#CCFF00] border-t-2 border-black w-full flex">
          {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="flex-1 border-r border-black/20"></div>
          ))}
      </div>
    </footer>
  );
}
