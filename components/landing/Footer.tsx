'use client';

import Link from 'next/link';
import { ArrowRight, Globe } from 'lucide-react';
import { useLanguage } from './LanguageContext';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="relative bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-8 sm:p-12 text-center mb-8 sm:mb-16 overflow-hidden shadow-2xl ring-1 ring-white/10">
             {/* Abstract Pattern matching Hero style */}
             <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
             
             {/* Ambient Glows */}
             <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
             <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none"></div>

             <div className="relative z-10">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                    {t.footer.ctaTitle}
                </h2>
                <div className="mt-8 flex justify-center">
            <button
              onClick={() => {
                const contactForm = document.getElementById('contact-form');
                contactForm?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-lg text-blue-600 bg-white hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              {t.footer.ctaButton}
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
                </div>
             </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-t border-gray-100 pt-8">
            <div className="flex items-center gap-2">
                <div className="bg-black text-white w-8 h-8 rounded-lg flex items-center justify-center shadow-lg shadow-black/20">
                    <div className="font-bold text-sm leading-none">S</div>
                </div>
                <span className="text-lg font-bold text-gray-900">Split Berlin</span>
            </div>
            <div className="text-sm text-gray-500">
                © {new Date().getFullYear()} Split Berlin. {t.footer.rights}
            </div>
            <div className="flex gap-6">
                <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">{t.footer.privacy}</a>
                <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">{t.footer.terms}</a>
                <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">Twitter</a>
            </div>
        </div>
      </div>
    </footer>
  );
}
