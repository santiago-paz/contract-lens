'use client';

import Link from 'next/link';
import { Globe } from 'lucide-react';
import { motion } from 'framer-motion';

import { useLanguage } from './LanguageContext';

export function Navbar() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">Split Berlin</span>
          </div>
          <div className="hidden md:flex items-center gap-8 mr-8">
            <button 
              onClick={() => document.getElementById('product-showcase')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              {t.nav.howItWorks}
            </button>
            <button 
              onClick={() => document.getElementById('bento-grid')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              {t.nav.features}
            </button>
            <button 
              onClick={() => document.getElementById('security')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              {t.nav.security}
            </button>
          </div>
          <div className="flex items-center gap-4">
             {/* Language Switcher */}
             <div className="pr-4 border-r border-gray-200">
               <div className="flex bg-gray-100 rounded-full p-1 relative">
                 <motion.div
                   className="absolute bg-white rounded-full shadow-sm"
                   initial={false}
                   animate={{
                     x: language === 'en' ? 0 : "100%"
                   }}
                   style={{
                     top: '4px',
                     bottom: '4px',
                     left: '4px',
                     width: 'calc(50% - 4px)'
                   }}
                   transition={{ type: "spring", stiffness: 300, damping: 30 }}
                 />
                 <button
                   onClick={() => setLanguage('en')}
                   className={`relative z-10 w-8 py-1 text-xs font-bold transition-colors text-center rounded-full ${
                     language === 'en' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'
                   }`}
                 >
                   EN
                 </button>
                 <button
                   onClick={() => setLanguage('de')}
                   className={`relative z-10 w-8 py-1 text-xs font-bold transition-colors text-center rounded-full ${
                     language === 'de' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'
                   }`}
                 >
                   DE
                 </button>
               </div>
             </div>

             <Link 
              href="/login" 
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              {t.nav.signIn}
            </Link>
            <button
              onClick={() => {
                const contactForm = document.getElementById('contact-form');
                contactForm?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors"
            >
              {t.nav.getStarted}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
