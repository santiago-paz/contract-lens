'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { useLanguage } from './LanguageContext';

const FeatureSection = ({ 
  title, 
  subtitle, 
  description, 
  children, 
  align = 'left',
  index
}: { 
  title: string, 
  subtitle: string, 
  description: string, 
  children: React.ReactNode, 
  align?: 'left' | 'right',
  index: number
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div ref={ref} className={`py-24 flex flex-col ${align === 'right' ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-16 items-center`}>
      <motion.div 
        initial={{ opacity: 0, x: align === 'left' ? -50 : 50 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="flex-1 space-y-8"
      >
        <div className="flex items-center gap-4">
            <span className="text-6xl font-black text-black/10 select-none">0{index}</span>
            <h3 className="text-4xl font-black uppercase tracking-tight leading-none">
                {title}
            </h3>
        </div>
        <div className="space-y-4 pl-4 border-l-2 border-[var(--accent)]">
            <h4 className="text-xl font-bold uppercase bg-[var(--accent)] text-black inline-block px-1">{subtitle}</h4>
            <p className="text-lg text-gray-600 leading-relaxed font-medium max-w-md">
                {description}
            </p>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="flex-1 w-full"
      >
        <div className="relative w-full bg-gray-50 border-hard p-2 shadow-hard-lg">
            <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>
            <div className="w-full h-full bg-white border-hard overflow-hidden relative">
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
        <div className="w-full h-full flex flex-col p-8 bg-white relative">
            <div className="absolute top-4 right-4 animate-pulse">
                <div className="w-3 h-3 bg-[var(--accent)] rounded-full"></div>
            </div>
            <div className="space-y-6 my-4">
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
                        className="flex items-center gap-4 group"
                    >
                        <div className={`
                            w-16 h-16 border-hard flex flex-col items-center justify-center shrink-0
                            ${item.status === 'CRITICAL' ? 'bg-[var(--accent)] text-black' : 'bg-white text-black'}
                        `}>
                            <span className="text-2xl font-black leading-none">{item.days}</span>
                            <span className="text-[10px] font-bold uppercase">{t.bauhaus.deadlines.visual.days}</span>
                        </div>
                        <div className="flex-1 border-b border-gray-200 pb-2 group-hover:border-black transition-colors">
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-sm uppercase">{item.label}</span>
                                {item.status === 'CRITICAL' && <AlertTriangle className="w-4 h-4 text-black fill-[var(--accent)]" />}
                            </div>
                            <div className="w-full h-1 bg-gray-100 mt-2 overflow-hidden">
                                <motion.div 
                                    className={`h-full ${item.status === 'CRITICAL' ? 'bg-[var(--accent)]' : 'bg-black'}`}
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
            className="w-full h-full flex relative overflow-hidden cursor-crosshair"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Left: Original */}
            <div className="w-1/2 h-full bg-white p-4 sm:p-6 border-r border-black/10 flex flex-col relative">
                <div className="h-6 flex items-center mb-4 sm:mb-6">
                     <h5 className="text-xs font-bold uppercase text-gray-400">{t.bauhaus.translation.visual.original}</h5>
                </div>
                <div className="space-y-4 opacity-100 flex-1 overflow-hidden">
                    {/* Header */}
                    <div className="h-3 w-1/2 bg-black/80 rounded-sm mb-2"></div>
                    
                    {/* Para 1 */}
                    <div className="space-y-2">
                        <div className="h-2 w-full bg-black/60 rounded-sm"></div>
                        <div className="h-2 w-full bg-black/60 rounded-sm"></div>
                        <div className="h-2 w-3/4 bg-black/60 rounded-sm"></div>
                    </div>

                    {/* Para 2 */}
                    <div className="space-y-2">
                        <div className="h-2 w-11/12 bg-black/60 rounded-sm"></div>
                        <div className="h-2 w-full bg-black/60 rounded-sm"></div>
                        <div className="h-2 w-5/6 bg-black/60 rounded-sm"></div>
                    </div>

                    {/* Highlighted Section */}
                    <div className="space-y-2 pt-2">
                        <div className="h-2 w-full bg-[var(--accent)]/40 rounded-sm"></div>
                        <div className="h-2 w-2/3 bg-[var(--accent)]/40 rounded-sm"></div>
                    </div>

                    {/* Para 3 */}
                    <div className="space-y-2">
                         <div className="h-2 w-full bg-black/60 rounded-sm"></div>
                         <div className="h-2 w-4/5 bg-black/60 rounded-sm"></div>
                         <div className="h-2 w-full bg-black/60 rounded-sm"></div>
                         <div className="h-2 w-3/4 bg-black/60 rounded-sm"></div>
                    </div>
                </div>
                {/* Gradient Overlay */}
                <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent z-10"></div>
            </div>

            {/* Right: Translated */}
            <div className="w-1/2 h-full bg-gray-50 p-4 sm:p-6 flex flex-col relative">
                <div className="h-6 flex items-center mb-4 sm:mb-6">
                    <h5 className="text-xs font-bold uppercase bg-[var(--accent)] text-black inline-block px-1">{t.bauhaus.translation.visual.translated}</h5>
                </div>
                <div className="space-y-4 flex-1 overflow-hidden">
                     {/* Header */}
                    <motion.div animate={{ opacity: hovered ? 1 : 0.5 }} className="h-3 w-1/2 bg-black/80 rounded-sm mb-2"></motion.div>

                    {/* Para 1 */}
                    <div className="space-y-2">
                        <motion.div animate={{ opacity: hovered ? 1 : 0.5 }} className="h-2 w-full bg-black/60 rounded-sm"></motion.div>
                        <motion.div animate={{ opacity: hovered ? 1 : 0.5 }} className="h-2 w-full bg-black/60 rounded-sm"></motion.div>
                        <motion.div animate={{ opacity: hovered ? 1 : 0.5 }} className="h-2 w-4/5 bg-black/60 rounded-sm"></motion.div>
                    </div>

                    {/* Para 2 */}
                    <div className="space-y-2">
                        <motion.div animate={{ opacity: hovered ? 1 : 0.5 }} className="h-2 w-10/12 bg-black/60 rounded-sm"></motion.div>
                        <motion.div animate={{ opacity: hovered ? 1 : 0.5 }} className="h-2 w-full bg-black/60 rounded-sm"></motion.div>
                        <motion.div animate={{ opacity: hovered ? 1 : 0.5 }} className="h-2 w-3/4 bg-black/60 rounded-sm"></motion.div>
                    </div>

                    {/* Highlighted Section */}
                    <div className="space-y-2 pt-2">
                        <motion.div animate={{ opacity: hovered ? 1 : 0.5 }} className="h-2 w-full bg-[var(--accent)]/40 rounded-sm"></motion.div>
                        <motion.div animate={{ opacity: hovered ? 1 : 0.5 }} className="h-2 w-3/4 bg-[var(--accent)]/40 rounded-sm"></motion.div>
                    </div>

                     {/* Para 3 */}
                    <div className="space-y-2">
                         <motion.div animate={{ opacity: hovered ? 1 : 0.5 }} className="h-2 w-11/12 bg-black/60 rounded-sm"></motion.div>
                         <motion.div animate={{ opacity: hovered ? 1 : 0.5 }} className="h-2 w-full bg-black/60 rounded-sm"></motion.div>
                         <motion.div animate={{ opacity: hovered ? 1 : 0.5 }} className="h-2 w-5/6 bg-black/60 rounded-sm"></motion.div>
                         <motion.div animate={{ opacity: hovered ? 1 : 0.5 }} className="h-2 w-3/4 bg-black/60 rounded-sm"></motion.div>
                    </div>
                </div>
                {/* Gradient Overlay */}
                <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-gray-50 to-transparent z-10"></div>
            </div>

            {/* Scanning Line */}
            <motion.div 
                className="absolute top-0 left-0 w-full h-1 bg-[var(--accent)] z-10 shadow-[0_0_15px_rgba(0,0,0,0.2)]"
                animate={{ top: ["0%", "100%", "0%"] }}
                transition={{ duration: 4, ease: "linear", repeat: Infinity }}
            />
        </div>
    );
};

// Feature 3: AI Draft
const AIDraftVisual = () => {
    const { t } = useLanguage();
    return (
        <div className="w-full h-full bg-slate-900 p-6 font-mono text-xs flex flex-col">
            <div className="flex justify-between items-center text-slate-500 mb-4 border-b border-slate-700 pb-2">
                <span>DRAFT_ARCHITECT_V1</span>
                <span className="text-[var(--accent)]">● {t.bauhaus.aiDraft.visual.status}</span>
            </div>
            <div className="flex-1 flex gap-4">
                <div className="w-1/3 border-r border-slate-700 pr-2 space-y-2">
                    <div className="text-slate-400 mb-2">{t.bauhaus.aiDraft.visual.components}</div>
                    {[
                        t.bauhaus.aiDraft.visual.jurisdiction,
                        t.bauhaus.aiDraft.visual.liability,
                        t.bauhaus.aiDraft.visual.term,
                        t.bauhaus.aiDraft.visual.payment
                    ].map(item => (
                        <div key={item} className="px-2 py-1 bg-slate-800 text-slate-300 border border-slate-700 hover:border-[var(--accent)] cursor-pointer transition-colors">
                            {item}
                        </div>
                    ))}
                </div>
                <div className="flex-1 space-y-2">
                    <div className="flex gap-1 text-[var(--accent)]">
                        <span>{'>'}</span>
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                        >
                            {t.bauhaus.aiDraft.visual.generating}
                        </motion.span>
                    </div>
                    <div className="text-slate-300 opacity-50">
                        {`{
  "clause": "${t.bauhaus.aiDraft.visual.clauseTitle}",
  "cap": "12 months fees",
  "exclusions": ["Fraud", "Gross Negligence"]
}`}
                    </div>
                    <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        transition={{ duration: 2 }}
                        className="p-3 bg-slate-800 border-l-2 border-[var(--accent)] text-slate-200 mt-4"
                    >
                        {t.bauhaus.aiDraft.visual.codeText}
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
        <div className="w-full h-full bg-white p-8 relative flex items-center justify-center">
             <div className="w-48 h-64 border-hard p-4 relative bg-white z-10 shadow-sm">
                <div className="space-y-4">
                    <div className="h-2 w-1/3 bg-black"></div>
                    <div className="space-y-1">
                        <div className="h-1 w-full bg-gray-300"></div>
                        <div className="h-1 w-full bg-gray-300"></div>
                        <div className="h-1 w-2/3 bg-gray-300"></div>
                    </div>
                    <div className="space-y-1">
                        <div className="h-1 w-full bg-gray-300"></div>
                        <div className="h-1 w-full bg-gray-300"></div>
                    </div>
                    <div className="space-y-1 pt-[74px]">
                        <div className="h-1 w-full bg-gray-300"></div>
                        <div className="h-1 w-4/5 bg-gray-300"></div>
                        <div className="h-1 w-1/2 bg-gray-300"></div>
                    </div>
                </div>
                
                {/* Labels */}
                <motion.div 
                    className="absolute -right-12 top-8 flex items-center gap-2"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <div className="w-8 h-[1px] bg-black"></div>
                    <span className="text-[10px] font-bold uppercase bg-black text-white px-1">{t.bauhaus.anatomy.visual.parties}</span>
                </motion.div>

                <motion.div 
                    className="absolute -left-12 top-20 flex items-center gap-2 flex-row-reverse"
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                >
                    <div className="w-8 h-[1px] bg-black"></div>
                    <span className="text-[10px] font-bold uppercase bg-[var(--accent)] text-black px-1">{t.bauhaus.anatomy.visual.obligations}</span>
                </motion.div>
                
                <motion.div 
                    className="absolute -right-12 bottom-12 flex items-center gap-2"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 }}
                >
                    <div className="w-8 h-[1px] bg-black"></div>
                    <span className="text-[10px] font-bold uppercase bg-black text-white px-1">{t.bauhaus.anatomy.visual.termination}</span>
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
    <section id="features" className="bg-white text-black py-32 overflow-hidden border-b border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-24 max-w-4xl mx-auto text-center">
            <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter mb-8 leading-snug md:leading-[0.9]">
                {t.bauhaus.header.title1} <span className="bg-[var(--accent)] text-black px-2">{t.bauhaus.header.title2}</span>
                <br className="hidden md:block" />
                {t.bauhaus.header.title3} <span className="border-b-4 border-black pb-1">{t.bauhaus.header.title4}</span>
            </h2>
            <p className="text-xl md:text-2xl font-medium text-gray-500 max-w-2xl mx-auto">
                {t.bauhaus.header.subtitle}
            </p>
        </div>

        <FeatureSection
            index={1}
            title={t.bauhaus.deadlines.title}
            subtitle={t.bauhaus.deadlines.subtitle}
            description={t.bauhaus.deadlines.description}
            align="left"
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
    </section>
  );
}
