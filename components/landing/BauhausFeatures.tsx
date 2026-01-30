'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { AlertTriangle, FileText } from 'lucide-react';
import { useLanguage } from './LanguageContext';

const FeatureSection = ({ 
  title, 
  subtitle, 
  description, 
  children, 
    align = 'left',
    index,
    visualAspectRatio = "aspect-square md:aspect-video lg:aspect-square"
  }: { 
    title: string, 
    subtitle: string, 
    description: string, 
    children: React.ReactNode, 
    align?: 'left' | 'right',
    index: number,
    visualAspectRatio?: string
  }) => {
    const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div ref={ref} className={`py-24 lg:py-32 flex flex-col ${align === 'right' ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-16 lg:gap-32 items-center`}>
      <motion.div 
        initial={{ opacity: 0, x: align === 'left' ? -50 : 50 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="flex-1 space-y-10"
      >
        <div className="flex items-start gap-6 relative">
            <span className="absolute -left-8 -top-12 text-[120px] font-black text-black/5 select-none leading-none z-0">0{index}</span>
            <div className="relative z-10 w-full">
              <h3 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-[0.9] break-words hyphens-auto mb-6">
                  {title}
              </h3>
              <h4 className="text-lg sm:text-xl font-bold font-mono uppercase bg-[var(--accent)] text-black inline-block px-2 py-1 mb-6 border-2 border-black shadow-hard-sm transform -rotate-1 max-w-full break-words leading-tight">
                {subtitle}
              </h4>
              <p className="text-xl text-black/80 leading-relaxed font-medium max-w-lg border-l-4 border-black pl-6">
                  {description}
              </p>
            </div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="flex-1 w-full"
      >
        <div className="relative w-full bg-white border-2 border-black p-3 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all duration-300">
            <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>
            <div className={`w-full h-full bg-white border-2 border-black overflow-hidden relative ${visualAspectRatio} !aspect-[4/6]`}>
                {children}
            </div>
        </div>
      </motion.div>
    </div>
  );
};

// Feature 1: Deadlines
const DeadlinesVisual = () => {
    const { t } = useLanguage();
    return (
        <div className="w-full h-full flex flex-col p-5 sm:p-8 bg-white relative bg-noise">
            <div className="flex justify-between items-center w-full mb-4 sm:mb-6 shrink-0">
                <div className="font-mono text-xs font-bold uppercase border border-black px-2 py-1 bg-white">
                    CRON_JOBS: ACTIVE
                </div>
                <div className="animate-pulse">
                    <div className="w-4 h-4 bg-[var(--accent)] border-2 border-black rounded-full"></div>
                </div>
            </div>
            <div className="flex-1 flex flex-col justify-center gap-4 md:gap-8 lg:justify-between lg:gap-0 py-2">
                {[
                    { days: 2, label: t.bauhaus.deadlines.visual.autoRenewal, status: "CRITICAL" },
                    { days: 15, label: t.bauhaus.deadlines.visual.exitClause, status: "WARNING" },
                    { days: 45, label: t.bauhaus.deadlines.visual.annualReview, status: "NORMAL" },
                ].map((item, i) => (
                    <motion.div 
                        key={i}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: i * 0.5, duration: 0.5 }}
                        className="flex items-center gap-6 group"
                    >
                        <div className={`
                            w-20 h-20 border-2 border-black flex flex-col items-center justify-center shrink-0 shadow-hard-sm transition-transform group-hover:scale-105
                            ${item.status === 'CRITICAL' ? 'bg-[var(--accent)] text-black' : 'bg-white text-black'}
                        `}>
                            <span className="text-3xl font-black leading-none">{item.days}</span>
                            <span className="text-[10px] font-bold uppercase">{t.bauhaus.deadlines.visual.days}</span>
                        </div>
                        <div className="flex-1 border-b-2 border-gray-200 pb-4 group-hover:border-black transition-colors relative">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-bold font-mono text-sm uppercase tracking-wide">{item.label}</span>
                                {item.status === 'CRITICAL' && <AlertTriangle className="w-5 h-5 text-black fill-[var(--accent)]" />}
                            </div>
                            <div className="w-full h-3 bg-gray-100 border border-black overflow-hidden relative">
                                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,0,0,0.1)_25%,rgba(0,0,0,0.1)_50%,transparent_50%,transparent_75%,rgba(0,0,0,0.1)_75%,rgba(0,0,0,0.1)_100%)] bg-[size:10px_10px] opacity-20"></div>
                                <motion.div 
                                    className={`h-full border-r-2 border-black ${item.status === 'CRITICAL' ? 'bg-[var(--accent)]' : 'bg-black'}`}
                                    initial={{ width: 0 }}
                                    animate={{ width: item.status === 'CRITICAL' ? '90%' : '40%' }}
                                    transition={{ duration: 1.5, delay: 0.5 + i * 0.2 }}
                                />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

// Feature 2: Translation
const TranslationVisual = () => {
    const { t } = useLanguage();
    const [hovered, setHovered] = useState(false);
    
    return (
        <div 
            className="w-full h-full flex flex-col sm:flex-row relative overflow-hidden cursor-crosshair bg-noise"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Left: Original */}
            <div className="w-full sm:w-1/2 h-1/2 sm:h-full bg-white p-6 sm:p-8 border-b-2 sm:border-b-0 sm:border-r-2 border-black flex flex-col relative">
                <div className="h-8 flex items-center mb-4 justify-between border-b-2 border-gray-100 pb-2 shrink-0">
                     <h5 className="text-xs font-bold font-mono uppercase text-gray-400">{t.bauhaus.translation.visual.original}</h5>
                     <div className="w-2 h-2 bg-black rounded-full"></div>
                </div>
                <div className="space-y-3 opacity-100 flex-1 overflow-hidden font-mono text-[10px] leading-relaxed select-none blur-[0.5px] flex flex-col justify-center">
                    {/* Header */}
                    <div className="h-4 w-2/3 bg-black rounded-none mb-2"></div>
                    
                    {/* Para 1 */}
                    <div className="space-y-1.5">
                        <div className="h-2 w-full bg-gray-300 rounded-none"></div>
                        <div className="h-2 w-full bg-gray-300 rounded-none"></div>
                        <div className="h-2 w-3/4 bg-gray-300 rounded-none"></div>
                    </div>

                    {/* Para 2 */}
                    <div className="space-y-1.5">
                        <div className="h-2 w-11/12 bg-gray-300 rounded-none"></div>
                        <div className="h-2 w-full bg-gray-300 rounded-none"></div>
                        <div className="h-2 w-5/6 bg-gray-300 rounded-none"></div>
                    </div>

                    {/* Highlighted Section */}
                    <div className="space-y-1.5 pt-1 relative">
                        <div className="absolute -left-2 top-0 w-1 h-full bg-[var(--accent)]"></div>
                        <div className="h-2 w-full bg-black rounded-none"></div>
                        <div className="h-2 w-2/3 bg-black rounded-none"></div>
                    </div>

                    {/* Para 3 */}
                    <div className="space-y-1.5">
                         <div className="h-2 w-full bg-gray-300 rounded-none"></div>
                         <div className="h-2 w-4/5 bg-gray-300 rounded-none"></div>
                    </div>
                </div>
            </div>

            {/* Right: Translated */}
            <div className="w-full sm:w-1/2 h-1/2 sm:h-full bg-gray-50 p-6 sm:p-8 flex flex-col relative">
                <div className="h-8 flex items-center mb-4 justify-between border-b-2 border-black pb-2 shrink-0">
                    <h5 className="text-xs font-bold font-mono uppercase bg-[var(--accent)] text-black inline-block px-2 border border-black">{t.bauhaus.translation.visual.translated}</h5>
                </div>
                <div className="space-y-3 flex-1 overflow-hidden font-mono text-[10px] leading-relaxed flex flex-col justify-center">
                     {/* Header */}
                    <motion.div animate={{ opacity: hovered ? 1 : 0.4 }} className="h-4 w-2/3 bg-black rounded-none mb-2 transition-opacity"></motion.div>

                    {/* Para 1 */}
                    <div className="space-y-1.5">
                        <motion.div animate={{ opacity: hovered ? 1 : 0.4 }} className="h-2 w-full bg-black rounded-none transition-opacity"></motion.div>
                        <motion.div animate={{ opacity: hovered ? 1 : 0.4 }} className="h-2 w-full bg-black rounded-none transition-opacity"></motion.div>
                        <motion.div animate={{ opacity: hovered ? 1 : 0.4 }} className="h-2 w-4/5 bg-black rounded-none transition-opacity"></motion.div>
                    </div>

                    {/* Para 2 */}
                    <div className="space-y-1.5">
                        <motion.div animate={{ opacity: hovered ? 1 : 0.4 }} className="h-2 w-10/12 bg-black rounded-none transition-opacity"></motion.div>
                        <motion.div animate={{ opacity: hovered ? 1 : 0.4 }} className="h-2 w-full bg-black rounded-none transition-opacity"></motion.div>
                        <motion.div animate={{ opacity: hovered ? 1 : 0.4 }} className="h-2 w-3/4 bg-black rounded-none transition-opacity"></motion.div>
                    </div>

                    {/* Highlighted Section */}
                    <div className="space-y-1.5 pt-1 relative">
                        <motion.div 
                            className="absolute -left-4 top-0 w-1 h-full bg-[var(--accent)]"
                            initial={{ height: 0 }}
                            animate={{ height: hovered ? '100%' : '0%' }}
                        />
                        <motion.div animate={{ opacity: hovered ? 1 : 0.4 }} className="h-2 w-full bg-[var(--accent)] border border-black rounded-none transition-opacity"></motion.div>
                        <motion.div animate={{ opacity: hovered ? 1 : 0.4 }} className="h-2 w-3/4 bg-[var(--accent)] border border-black rounded-none transition-opacity"></motion.div>
                    </div>

                     {/* Para 3 */}
                    <div className="space-y-1.5">
                         <motion.div animate={{ opacity: hovered ? 1 : 0.4 }} className="h-2 w-11/12 bg-black rounded-none transition-opacity"></motion.div>
                         <motion.div animate={{ opacity: hovered ? 1 : 0.4 }} className="h-2 w-full bg-black rounded-none transition-opacity"></motion.div>
                    </div>
                </div>
            </div>

            {/* Scanning Effect - Sophisticated */}
            <motion.div 
                className="absolute left-0 w-full h-[15%] bg-gradient-to-b from-transparent via-[var(--accent)]/20 to-transparent z-20 pointer-events-none flex items-center"
                animate={{ top: ["-20%", "120%"] }}
                transition={{ duration: 3, ease: "linear", repeat: Infinity }}
            >
                <div className="w-full h-[2px] bg-[var(--accent)] shadow-[0_0_15px_2px_rgba(204,255,0,0.8)]"></div>
            </motion.div>
        </div>
    );
};

// Feature 3: AI Draft
const AIDraftVisual = () => {
    const { t } = useLanguage();
    return (
        <div className="w-full h-full bg-slate-900 p-8 font-mono text-xs flex flex-col relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>
            
            <div className="flex justify-between items-center text-slate-500 mb-6 border-b border-slate-700 pb-3 relative z-10">
                <span className="font-bold text-slate-300">DRAFT_ARCHITECT_V1.0</span>
                <span className="text-[var(--accent)] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse"></span>
                    {t.bauhaus.aiDraft.visual.status}
                </span>
            </div>
            
            <div className="flex-1 flex flex-col sm:flex-row gap-8 relative z-10">
                <div className="w-full sm:w-1/3 border-b sm:border-b-0 sm:border-r border-slate-700 pb-6 sm:pb-0 sm:pr-4 space-y-3">
                    <div className="text-slate-400 font-bold uppercase tracking-wider mb-2 text-[10px]">{t.bauhaus.aiDraft.visual.components}</div>
                    {[
                        t.bauhaus.aiDraft.visual.jurisdiction,
                        t.bauhaus.aiDraft.visual.liability,
                        t.bauhaus.aiDraft.visual.term,
                        t.bauhaus.aiDraft.visual.payment
                    ].map((item, idx) => (
                        <motion.div 
                            key={item} 
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            className="px-3 py-2 bg-slate-800 text-slate-300 border border-slate-700 hover:border-[var(--accent)] hover:text-[var(--accent)] cursor-pointer transition-all hover:translate-x-1"
                        >
                            {`> ${item}`}
                        </motion.div>
                    ))}
                </div>
                
                <div className="flex-1 space-y-4">
                    <div className="flex gap-2 text-[var(--accent)] font-bold">
                        <span>root@split:~$</span>
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                        >
                            {t.bauhaus.aiDraft.visual.generating}
                        </motion.span>
                    </div>
                    
                    <div className="text-slate-400 font-mono text-[10px] bg-slate-950 p-4 border border-slate-800 rounded-none shadow-inner">
                        <span className="text-blue-400">const</span> <span className="text-yellow-400">agreement</span> = <span className="text-purple-400">new</span> <span className="text-green-400">Contract</span>({`{
  type: "${t.bauhaus.aiDraft.visual.clauseTitle}",
  terms: {
    cap: "12_MONTHS_FEES",
    exclusions: ["FRAUD", "GROSS_NEGLIGENCE"]
  }
}`});
                    </div>
                    
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="p-4 bg-slate-800/50 border-l-4 border-[var(--accent)] text-slate-200 mt-2 font-serif italic relative"
                    >
                        <div className="absolute top-0 right-0 p-1 text-[var(--accent)] opacity-20">
                            <FileText size={40} />
                        </div>
                        "{t.bauhaus.aiDraft.visual.codeText}"
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

// Feature 4: Anatomy
const AnatomyVisual = () => {
    const { t } = useLanguage();
    return (
        <div className="w-full h-full bg-white p-4 sm:p-12 relative flex items-center justify-center bg-noise">
             <div className="w-56 h-72 border-2 border-black p-6 relative bg-white z-10 shadow-hard-lg rotate-1 transition-transform hover:rotate-0 duration-500">
                <div className="space-y-5">
                    <div className="h-3 w-1/3 bg-black"></div>
                    <div className="space-y-1.5">
                        <div className="h-1.5 w-full bg-gray-200"></div>
                        <div className="h-1.5 w-full bg-gray-200"></div>
                        <div className="h-1.5 w-2/3 bg-gray-200"></div>
                    </div>
                    <div className="space-y-1.5">
                        <div className="h-1.5 w-full bg-gray-200"></div>
                        <div className="h-1.5 w-full bg-gray-200"></div>
                    </div>
                    <div className="space-y-1.5 pt-12">
                        <div className="h-1.5 w-full bg-gray-200"></div>
                        <div className="h-1.5 w-4/5 bg-gray-200"></div>
                        <div className="h-1.5 w-1/2 bg-gray-200"></div>
                    </div>
                </div>
                
                {/* Labels */}
                <motion.div 
                    className="absolute -right-8 sm:-right-16 top-10 flex items-center gap-2"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <div className="w-6 sm:w-12 h-[2px] bg-black"></div>
                    <span className="text-[10px] font-black font-mono uppercase bg-black text-white px-2 py-1 shadow-hard-sm transform rotate-2">{t.bauhaus.anatomy.visual.parties}</span>
                </motion.div>

                <motion.div 
                    className="absolute -left-8 sm:-left-16 top-24 flex items-center gap-2 flex-row-reverse"
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                >
                    <div className="w-6 sm:w-12 h-[2px] bg-black"></div>
                    <span className="text-[10px] font-black font-mono uppercase bg-[var(--accent)] text-black border border-black px-2 py-1 shadow-hard-sm transform -rotate-2">{t.bauhaus.anatomy.visual.obligations}</span>
                </motion.div>
                
                <motion.div 
                    className="absolute -right-8 sm:-right-16 bottom-16 flex items-center gap-2"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 }}
                >
                    <div className="w-6 sm:w-12 h-[2px] bg-black"></div>
                    <span className="text-[10px] font-black font-mono uppercase bg-white border border-black text-black px-2 py-1 shadow-hard-sm transform rotate-1">{t.bauhaus.anatomy.visual.termination}</span>
                </motion.div>
             </div>
             
             {/* Grid overlay */}
             <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:20px_20px]"></div>
        </div>
    );
};

export function BauhausFeatures() {
  const { t } = useLanguage();
  
  return (
    <section id="features" className="bg-white text-black py-24 lg:py-32 overflow-hidden border-b-2 border-black bg-noise relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-24 max-w-5xl mx-auto text-center">
            <h2 className="text-5xl sm:text-7xl font-black uppercase tracking-tighter mb-8 leading-[1.1] sm:leading-[0.85] break-words hyphens-auto">
                {t.bauhaus.header.title1} <span className="relative inline-block px-4"><span className="absolute inset-0 bg-[var(--accent)] transform -skew-x-6 border-2 border-black shadow-hard-sm"></span><span className="relative z-10">{t.bauhaus.header.title2}</span></span>
                <br className="hidden md:block" />
                {t.bauhaus.header.title3} <span className="inline-block border-b-8 border-black pb-2 sm:pb-4 leading-none">{t.bauhaus.header.title4}</span>
            </h2>
            <p className="text-xl md:text-3xl font-mono text-black/70 max-w-3xl mx-auto leading-relaxed">
                {t.bauhaus.header.subtitle}
            </p>
        </div>

        <div className="space-y-12">
            <FeatureSection
                index={1}
                title={t.bauhaus.deadlines.title}
                subtitle={t.bauhaus.deadlines.subtitle}
                description={t.bauhaus.deadlines.description}
                align="left"
                visualAspectRatio="aspect-square md:aspect-video lg:aspect-square"
            >
                <DeadlinesVisual />
            </FeatureSection>

            <FeatureSection
                index={2}
                title={t.bauhaus.translation.title}
                subtitle={t.bauhaus.translation.subtitle}
                description={t.bauhaus.translation.description}
                align="right"
            >
                <TranslationVisual />
            </FeatureSection>

            <FeatureSection
                index={3}
                title={t.bauhaus.aiDraft.title}
                subtitle={t.bauhaus.aiDraft.subtitle}
                description={t.bauhaus.aiDraft.description}
                align="left"
            >
                <AIDraftVisual />
            </FeatureSection>

            <FeatureSection
                index={4}
                title={t.bauhaus.anatomy.title}
                subtitle={t.bauhaus.anatomy.subtitle}
                description={t.bauhaus.anatomy.description}
                align="right"
            >
                <AnatomyVisual />
            </FeatureSection>
        </div>
      </div>
    </section>
  );
}
