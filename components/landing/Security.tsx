'use client';

import { Shield, Lock, Server } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { motion } from 'framer-motion';

export function Security() {
  const { t } = useLanguage();

  return (
    <div id="security" className="py-24 sm:py-32 bg-white relative overflow-hidden border-b-2 border-black bg-noise">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-100 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
            <motion.div 
                initial={{ opacity: 0, y: -10 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-3 px-6 py-3 bg-black text-white mb-8 border-2 border-black shadow-hard-sm"
            >
                <Shield className="w-5 h-5 text-[#00D4FF]" />
                <span className="text-base font-bold font-mono uppercase tracking-widest">{t.security.defenseProtocol}</span>
            </motion.div>
            
            <h2 className="text-4xl sm:text-5xl font-black text-black uppercase tracking-tighter mb-4">
                {t.security.titlePart1} <span className="bg-black text-white px-2">{t.security.titlePart2}</span>
            </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
            {/* Encryption Card */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group relative flex flex-col items-center text-center p-10 bg-white border-2 border-black shadow-hard hover:shadow-[8px_8px_0px_0px_#000] hover:-translate-y-1 transition-all duration-300"
            >
                <div className="absolute top-0 left-0 bg-black text-white text-[10px] font-mono px-2 py-1 uppercase">SEC_LAYER_01</div>
                
                <div className="mb-8 relative mt-4">
                    <div className="w-20 h-20 bg-[#00D4FF] border-2 border-black flex items-center justify-center shadow-hard-sm group-hover:rotate-6 transition-transform">
                        <Lock className="w-10 h-10 text-black" />
                    </div>
                </div>
                
                <h3 className="text-2xl font-black font-mono text-black mb-4 uppercase tracking-tighter">{t.security.encryption.title}</h3>
                <p className="text-black/80 font-mono text-sm leading-relaxed uppercase border-t-2 border-black pt-4 w-full">
                    {t.security.encryption.desc}
                </p>
            </motion.div>

            {/* AI Privacy Card */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="group relative flex flex-col items-center text-center p-10 bg-black border-2 border-black shadow-hard hover:shadow-[8px_8px_0px_0px_#00D4FF] hover:-translate-y-1 transition-all duration-300"
            >
                <div className="absolute top-0 left-0 bg-[#00D4FF] text-black text-[10px] font-mono px-2 py-1 uppercase font-bold">SEC_LAYER_02</div>

                <div className="mb-8 relative mt-4">
                    <div className="w-20 h-20 bg-white border-2 border-white flex items-center justify-center shadow-hard-sm group-hover:-rotate-6 transition-transform">
                        <Shield className="w-10 h-10 text-black" />
                    </div>
                </div>

                <h3 className="text-2xl font-black font-mono text-white mb-4 uppercase tracking-tighter">{t.security.ai.title}</h3>
                <p className="text-gray-400 font-mono text-sm leading-relaxed uppercase border-t-2 border-white/20 pt-4 w-full group-hover:text-white transition-colors">
                    {t.security.ai.desc}
                </p>
            </motion.div>

            {/* Hosting Card */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="group relative flex flex-col items-center text-center p-10 bg-white border-2 border-black shadow-hard hover:shadow-[8px_8px_0px_0px_#000] hover:-translate-y-1 transition-all duration-300"
            >
                <div className="absolute top-0 left-0 bg-black text-white text-[10px] font-mono px-2 py-1 uppercase">SEC_LAYER_03</div>

                <div className="mb-8 relative mt-4">
                    <div className="w-20 h-20 bg-white border-2 border-black flex items-center justify-center shadow-hard-sm group-hover:scale-110 transition-transform">
                        <Server className="w-10 h-10 text-black" />
                    </div>
                </div>

                <h3 className="text-2xl font-black font-mono text-black mb-4 uppercase tracking-tighter">{t.security.hosting.title}</h3>
                <p className="text-black/80 font-mono text-sm leading-relaxed uppercase border-t-2 border-black pt-4 w-full">
                    {t.security.hosting.desc}
                </p>
            </motion.div>
        </div>
      </div>
    </div>
  );
}
