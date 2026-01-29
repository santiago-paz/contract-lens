'use client';

import { motion } from 'framer-motion';
import { useLanguage } from './LanguageContext';

export function ProductShowcase() {
  const { t } = useLanguage();

  return (
    <div id="product-showcase" className="py-24 sm:py-32 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-6xl font-bold text-gray-900 tracking-tighter mb-6">
            {t.showcase.title}
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
             {t.showcase.subtitle}
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="relative rounded-xl overflow-hidden shadow-2xl ring-1 ring-gray-900/10 bg-gray-900 max-w-5xl mx-auto"
        >
             {/* Window Controls Mockup */}
            <div className="h-10 bg-gray-800/80 backdrop-blur-md flex items-center px-4 gap-2 border-b border-gray-700">
                <div className="w-3 h-3 rounded-full bg-[#FF5F57]"></div>
                <div className="w-3 h-3 rounded-full bg-[#FEBC2E]"></div>
                <div className="w-3 h-3 rounded-full bg-[#28C840]"></div>
            </div>
            
            <div className="relative bg-gray-800">
                <video 
                    src="/screenshots-app/showcase-app.mp4"
                    className="w-full h-auto"
                    autoPlay
                    muted
                    loop
                    playsInline
                    controls
                />
            </div>
        </motion.div>
      </div>
    </div>
  );
}
