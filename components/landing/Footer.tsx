'use client';

import Link from 'next/link';
import { ArrowRight, Globe } from 'lucide-react';
import { useLanguage } from './LanguageContext';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-white border-t-2 border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="relative bg-black text-white p-8 sm:p-12 text-center mb-16 shadow-hard overflow-hidden border-2 border-black">
             {/* Abstract Pattern */}
             <div className="absolute inset-0 opacity-20 bg-[linear-gradient(45deg,#CCFF00_1px,transparent_1px),linear-gradient(-45deg,#CCFF00_1px,transparent_1px)] [background-size:20px_20px]"></div>
             
             <div className="relative z-10">
                <h2 className="text-3xl sm:text-5xl font-black text-white mb-8 uppercase tracking-tighter">
                    {t.footer.ctaTitle}
                </h2>
                <div className="mt-8 flex justify-center">
                    <button
                      onClick={() => {
                        const contactForm = document.getElementById('contact-form');
                        contactForm?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="group inline-flex items-center justify-center px-8 py-4 text-base font-bold font-mono uppercase bg-[#CCFF00] text-black border-2 border-white hover:bg-white hover:text-black hover:border-black transition-all shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
                    >
                      {t.footer.ctaButton}
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
             </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-t-2 border-black pt-8">
            <div className="flex items-center gap-2">
                <div className="bg-black text-[#CCFF00] w-10 h-10 border-2 border-black flex items-center justify-center">
                    <div className="font-mono font-bold text-xl leading-none">S</div>
                </div>
                <span className="text-xl font-bold font-mono uppercase text-black tracking-tighter">Split Berlin</span>
            </div>
            <div className="text-sm font-mono text-black">
                © {new Date().getFullYear()} SPLIT BERLIN. {t.footer.rights}
            </div>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-center">
                <a href="#" className="font-mono text-sm uppercase font-bold text-black hover:bg-[#CCFF00] px-1 transition-colors">{t.footer.privacy}</a>
                <a href="#" className="font-mono text-sm uppercase font-bold text-black hover:bg-[#CCFF00] px-1 transition-colors">{t.footer.terms}</a>
                <a href="#" className="font-mono text-sm uppercase font-bold text-black hover:bg-[#CCFF00] px-1 transition-colors">Twitter</a>
            </div>
        </div>
      </div>
    </footer>
  );
}
