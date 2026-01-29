'use client';

import { motion } from 'framer-motion';
import { useLanguage } from './LanguageContext';

export function ProductShowcase() {
  const { t } = useLanguage();

  return (
    <div id="product-showcase" className="py-24 sm:py-32 bg-white relative overflow-hidden border-b-2 border-black">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-100 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-6xl font-black text-black tracking-tighter mb-6 uppercase">
            {t.showcase.title}
          </h2>
          <p className="text-xl font-mono text-black max-w-2xl mx-auto border-l-4 border-[#CCFF00] pl-4">
             {t.showcase.subtitle}
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="relative border-2 border-black bg-white shadow-hard-lg max-w-5xl mx-auto"
        >
             {/* Window Controls Mockup */}
            <div className="h-10 bg-black flex items-center justify-between px-4 border-b-2 border-black">
                <div className="flex gap-2">
                    <div className="w-4 h-4 bg-[#CCFF00] border border-white hover:bg-white cursor-pointer transition-colors"></div>
                    <div className="w-4 h-4 bg-transparent border border-white hover:bg-white cursor-pointer transition-colors"></div>
                    <div className="w-4 h-4 bg-transparent border border-white hover:bg-white cursor-pointer transition-colors"></div>
                </div>
                <div className="text-white font-mono text-xs uppercase tracking-widest">System_Preview_Mode</div>
            </div>
            
            <div className="relative bg-black p-2">
                <div className="border border-white/20">
                    <video 
                        src="/screenshots-app/showcase-app.mp4"
                        className="w-full h-auto grayscale hover:grayscale-0 transition-all duration-500"
                        autoPlay
                        muted
                        loop
                        playsInline
                        controls
                    />
                </div>
            </div>
        </motion.div>
      </div>
    </div>
  );
}
