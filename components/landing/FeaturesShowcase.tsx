'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Check, Copy, Loader2 } from 'lucide-react';
import { useLanguage } from './LanguageContext';

const FeatureSection = ({
  title,
  subtitle,
  description,
  children,
    align = 'left',
    index,
    visualClassName = "h-full"
  }: {
    title: string,
    subtitle: string,
    description: string,
    children: React.ReactNode,
    align?: 'left' | 'right',
    index: number,
    visualClassName?: string
  }) => {
    const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div ref={ref} className={`py-16 flex flex-col ${align === 'right' ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-16 lg:gap-16 items-center`}>
      <motion.div
        initial={{ opacity: 0, x: align === 'left' ? -50 : 50 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="flex-1 space-y-10 min-w-0"
      >
        <div className="flex items-start gap-6 relative">
            <span className="absolute -left-8 -top-12 text-[120px] font-black text-black/5 select-none leading-none z-0" aria-hidden="true">0{index}</span>
            <div className="relative z-10 w-full max-w-xl">
              <h3 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-[0.95] hyphens-auto mb-6">
                  {title}
              </h3>
              <p className="text-base sm:text-lg font-bold font-mono uppercase bg-[var(--accent)] text-black inline-block px-2 py-1 mb-6 border-2 border-black shadow-hard-sm max-w-full break-words leading-tight">
                {subtitle}
              </p>
              <p className="text-lg sm:text-xl text-black/80 leading-relaxed font-medium max-w-lg border-l-4 border-black pl-6">
                  {description}
              </p>
            </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="flex-1 w-full min-w-0"
      >
        <div className="relative w-full bg-white border-2 border-black p-3 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all duration-300">
            <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" aria-hidden="true"></div>
            <div className={`w-full bg-white border-2 border-black overflow-hidden relative ${visualClassName}`}>
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
                    {t.features.deadlines.visual.cronJobs}
                </div>
                <div className="w-4 h-4 bg-[var(--accent)] border-2 border-black" aria-hidden="true"></div>
            </div>
            <div className="flex-1 flex flex-col justify-center gap-4 md:gap-8 lg:justify-between lg:gap-0 py-2 md:pb-8">
                {[
                    { days: 2, label: t.features.deadlines.visual.autoRenewal, status: "CRITICAL" },
                    { days: 15, label: t.features.deadlines.visual.exitClause, status: "WARNING" },
                    { days: 45, label: t.features.deadlines.visual.annualReview, status: "NORMAL" },
                ].map((item, i) => (
                    <motion.div
                        key={i}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: i * 0.5, duration: 0.5 }}
                        className="flex items-center gap-6 group md:mb-4"
                    >
                        <div className={`
                            w-20 h-20 border-2 border-black flex flex-col items-center justify-center shrink-0 shadow-hard-sm
                            ${item.status === 'CRITICAL' ? 'bg-[var(--accent)] text-black' : 'bg-white text-black'}
                        `}>
                            <span className="text-3xl font-black leading-none">{item.days}</span>
                            <span className="text-[11px] font-bold uppercase">{t.features.deadlines.visual.days}</span>
                        </div>
                        <div className="flex-1 border-b-2 border-gray-300 pb-4 group-hover:border-black transition-colors relative">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-bold font-mono text-sm uppercase tracking-wide">{item.label}</span>
                                {item.status === 'CRITICAL' && <AlertTriangle className="w-5 h-5 text-black fill-[var(--accent)]" aria-hidden="true" />}
                            </div>
                            <div className="w-full h-3 bg-gray-100 border border-black overflow-hidden relative">
                                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,0,0,0.1)_25%,rgba(0,0,0,0.1)_50%,transparent_50%,transparent_75%,rgba(0,0,0,0.1)_75%,rgba(0,0,0,0.1)_100%)] bg-[size:10px_10px] opacity-20" aria-hidden="true"></div>
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
    const reduceMotion = useReducedMotion();
    const [activeSection, setActiveSection] = useState(-1);
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: false, margin: "-100px" });

    // Cycle through sections: -1 (idle) → 0,1,2,3,4 (translating) → 5 (all done) → pause → reset.
    // With reduced motion, skip the loop and show the finished state.
    useEffect(() => {
        if (reduceMotion) {
            setActiveSection(5);
            return;
        }
        if (!isInView) return;
        let timeout: NodeJS.Timeout;
        const cycle = () => {
            setActiveSection(-1);
            // Stagger through each section
            const delays = [500, 1800, 3100, 4400, 5700];
            delays.forEach((delay, i) => {
                setTimeout(() => setActiveSection(i), delay);
            });
            // Show "all done" state, then reset
            setTimeout(() => setActiveSection(5), 7000);
            timeout = setTimeout(cycle, 9000);
        };
        cycle();
        return () => clearTimeout(timeout);
    }, [isInView, reduceMotion]);

    const sections = [
        { id: 'header', leftWidths: ['w-2/3'], rightWidths: ['w-2/3'], isHighlighted: false, isHeader: true },
        { id: 'para1', leftWidths: ['w-full', 'w-full', 'w-3/4'], rightWidths: ['w-full', 'w-full', 'w-4/5'], isHighlighted: false },
        { id: 'para2', leftWidths: ['w-11/12', 'w-full', 'w-5/6'], rightWidths: ['w-10/12', 'w-full', 'w-3/4'], isHighlighted: false },
        { id: 'clause', leftWidths: ['w-full', 'w-2/3'], rightWidths: ['w-full', 'w-3/4'], isHighlighted: true },
        { id: 'para3', leftWidths: ['w-full', 'w-4/5'], rightWidths: ['w-11/12', 'w-full'], isHighlighted: false },
    ];

    return (
        <div ref={ref} className="w-full h-full flex flex-col sm:flex-row relative overflow-hidden bg-noise">
            {/* Left: Original */}
            <div className="w-full sm:w-1/2 h-1/2 sm:h-full bg-white p-6 sm:p-8 border-b-2 sm:border-b-0 sm:border-r-2 border-black flex flex-col relative">
                <div className="h-8 flex items-center mb-4 justify-between border-b-2 border-gray-200 pb-2 shrink-0">
                     <p className="text-xs font-bold font-mono uppercase text-gray-600">{t.features.translation.visual.original}</p>
                     <div className="w-2 h-2 bg-black rounded-full" aria-hidden="true"></div>
                </div>
                <div className="space-y-4 flex-1 overflow-hidden font-mono select-none blur-[0.5px] flex flex-col justify-center" aria-hidden="true">
                    {sections.map((section, i) => {
                        const isActive = activeSection === i;
                        const isPast = activeSection > i;
                        return (
                            <div key={section.id} className={`relative ${section.isHeader ? 'mb-1' : ''}`}>
                                {/* Active reading highlight */}
                                <motion.div
                                    className="absolute -inset-x-2 -inset-y-1 bg-[var(--accent)]/15 border-l-2 border-[var(--accent)] pointer-events-none"
                                    initial={false}
                                    animate={{ opacity: isActive ? 1 : 0 }}
                                    transition={{ duration: 0.3 }}
                                />
                                <div className={`space-y-2.5 relative ${section.isHighlighted ? 'pt-1' : ''}`}>
                                    {section.isHighlighted && (
                                        <div className="absolute -left-2 top-0 w-1 h-full bg-[var(--accent)]"></div>
                                    )}
                                    {section.leftWidths.map((w, j) => (
                                        <motion.div
                                            key={j}
                                            className={`${section.isHeader ? 'h-5' : 'h-3'} ${w} rounded-none ${
                                                section.isHighlighted ? 'bg-black' : isPast || isActive ? 'bg-gray-400' : 'bg-gray-300'
                                            }`}
                                            animate={{
                                                backgroundColor: isActive
                                                    ? section.isHighlighted ? '#000' : '#9ca3af'
                                                    : section.isHighlighted ? '#000' : '#d1d5db'
                                            }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Right: Translated */}
            <div className="w-full sm:w-1/2 h-1/2 sm:h-full bg-gray-50 p-6 sm:p-8 flex flex-col relative">
                <div className="h-8 flex items-center mb-4 justify-between border-b-2 border-black pb-2 shrink-0">
                    <p className="text-xs font-bold font-mono uppercase bg-[var(--accent)] text-black inline-block px-2 border border-black">{t.features.translation.visual.translated}</p>
                </div>
                <div className="space-y-4 flex-1 overflow-hidden font-mono flex flex-col justify-center" aria-hidden="true">
                    {sections.map((section, i) => {
                        const isTranslated = activeSection > i || activeSection === 5;
                        const isTranslating = activeSection === i;
                        return (
                            <div key={section.id} className={`relative ${section.isHeader ? 'mb-1' : ''}`}>
                                <div className={`space-y-2.5 relative ${section.isHighlighted ? 'pt-1' : ''}`}>
                                    {section.isHighlighted && (
                                        <motion.div
                                            className="absolute -left-4 top-0 w-1 bg-[var(--accent)]"
                                            initial={false}
                                            animate={{ height: isTranslated ? '100%' : '0%' }}
                                            transition={{ duration: 0.4 }}
                                        />
                                    )}
                                    {section.rightWidths.map((w, j) => (
                                        <div key={j} className="relative">
                                            {/* Shimmer effect while translating */}
                                            {isTranslating && (
                                                <motion.div
                                                    className={`absolute inset-0 ${section.isHeader ? 'h-5' : 'h-3'} bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%]`}
                                                    animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
                                                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                                />
                                            )}
                                            <motion.div
                                                className={`${section.isHeader ? 'h-5' : 'h-3'} ${w} rounded-none relative ${
                                                    section.isHighlighted
                                                        ? 'bg-[var(--accent)] border border-black'
                                                        : 'bg-black'
                                                }`}
                                                initial={false}
                                                animate={{
                                                    opacity: isTranslated ? 1 : isTranslating ? 0.3 : 0.08,
                                                    scaleX: isTranslated ? 1 : isTranslating ? 0.95 : 1,
                                                }}
                                                transition={{
                                                    duration: 0.5,
                                                    delay: isTranslated ? j * 0.1 : 0,
                                                }}
                                                style={{ transformOrigin: 'left' }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Reading cursor on the left side */}
            {activeSection >= 0 && activeSection < 5 && !reduceMotion && (
                <motion.div
                    className="absolute left-0 sm:w-1/2 w-full h-[2px] bg-[var(--accent)] z-20 pointer-events-none"
                    layoutId="readingCursor"
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    aria-hidden="true"
                />
            )}
        </div>
    );
};

// Feature 3: AI Draft
const AIDraftVisual = () => {
    const { t } = useLanguage();
    const [activeComponent, setActiveComponent] = useState<string | null>(null);
    const [generationState, setGenerationState] = useState<'idle' | 'generating' | 'completed'>('idle');
    const [showCopyFeedback, setShowCopyFeedback] = useState(false);

    const getGeneratedText = (component: string) => {
        // Simplified mapping for visual effect
        const textMap: Record<string, string[]> = {
            [t.features.aiDraft.visual.jurisdiction]: t.features.aiDraft.visual.snippets.jurisdiction,
            [t.features.aiDraft.visual.liability]: t.features.aiDraft.visual.snippets.liability,
            [t.features.aiDraft.visual.term]: t.features.aiDraft.visual.snippets.term,
            [t.features.aiDraft.visual.payment]: t.features.aiDraft.visual.snippets.payment
        };
        return textMap[component] || [t.features.aiDraft.visual.clauseGenerated, t.features.aiDraft.visual.validated];
    };

    const handleCopy = async () => {
        if (!activeComponent) return;
        try {
            await navigator.clipboard.writeText(getGeneratedText(activeComponent).join('\n'));
        } catch {
            // Clipboard access can be denied; the feedback is still shown for the demo.
        }
        setShowCopyFeedback(true);
        setTimeout(() => setShowCopyFeedback(false), 2000);
    };

    const handleComponentSelect = (item: string) => {
        if (activeComponent === item) return;

        setActiveComponent(item);
        setGenerationState('generating');

        // Simulate generation process
        setTimeout(() => {
            setGenerationState('completed');
        }, 1500);
    };

    return (
        <div className="w-full h-full bg-neutral-950 flex flex-col relative overflow-hidden font-mono">
            <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" aria-hidden="true"></div>

            {/* Header */}
            <div className="flex justify-between items-center px-5 py-3 border-b border-neutral-800 bg-neutral-950 z-20 sticky top-0">
                <span className="font-bold text-neutral-200 text-xs tracking-wide uppercase">{t.features.aiDraft.visual.engineTitle}</span>
                <span className="text-[var(--accent)] flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 bg-[var(--accent)]" aria-hidden="true"></span>
                    {t.features.aiDraft.visual.readyStatus}
                </span>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex flex-col relative z-10 overflow-hidden">
                {/* Scrollable List */}
                <div className="flex-1 overflow-y-auto p-5 space-y-2">
                    <div className="text-neutral-400 font-bold text-[11px] uppercase tracking-wider mb-2 px-1">
                        {t.features.aiDraft.visual.components}
                    </div>
                    {[
                        t.features.aiDraft.visual.jurisdiction,
                        t.features.aiDraft.visual.liability,
                        t.features.aiDraft.visual.term,
                        t.features.aiDraft.visual.payment
                    ].map((item, idx) => (
                        <motion.button
                            key={item}
                            onClick={() => handleComponentSelect(item)}
                            aria-pressed={activeComponent === item}
                            whileTap={{ scale: 0.98 }}
                            initial={{ x: -10, opacity: 0 }}
                            animate={{
                                x: 0,
                                opacity: 1,
                                backgroundColor: activeComponent === item ? '#CCFF00' : '#262626',
                                borderColor: activeComponent === item ? '#CCFF00' : 'rgb(64 64 64)',
                                color: activeComponent === item ? '#000000' : 'rgb(229 229 229)',
                            }}
                            transition={{ delay: idx * 0.1 }}
                            className="w-full text-left px-4 py-3 border-2 transition-colors relative overflow-hidden group min-h-[48px] flex items-center focus-visible:outline-white"
                        >
                            <span className="font-bold text-sm relative z-10">{`> ${item}`}</span>
                        </motion.button>
                    ))}

                    {/* Document Preview */}
                    <AnimatePresence mode="wait">
                        {activeComponent && (
                            <motion.div
                                key={activeComponent}
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="mt-4 p-4 bg-black border border-neutral-800 relative min-h-[120px]">
                                    <button
                                        type="button"
                                        onClick={handleCopy}
                                        aria-label={t.features.aiDraft.visual.copyAria}
                                        className="absolute top-0 right-0 p-2 text-neutral-400 hover:text-white transition-colors z-20 focus-visible:outline-white"
                                    >
                                        <Copy size={16} aria-hidden="true" />
                                        <AnimatePresence>
                                            {showCopyFeedback && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: -10, scale: 0.9 }}
                                                    role="status"
                                                    className="absolute right-0 top-8 bg-[var(--accent)] text-black text-[11px] font-bold uppercase whitespace-nowrap px-3 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-black z-50 pointer-events-none"
                                                >
                                                    {t.features.aiDraft.visual.copyToast}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </button>
                                    <div className="space-y-3">
                                         {/* Document Header */}
                                        {generationState === 'completed' ? (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="text-xs font-bold text-[var(--accent)] mb-4 uppercase tracking-wider"
                                            >
                                                {`§ ${activeComponent}`}
                                            </motion.div>
                                        ) : (
                                            <div className="h-2 w-1/3 bg-neutral-800 mb-4" aria-hidden="true"></div>
                                        )}

                                        {/* Dynamic Content Area */}
                                        {generationState === 'generating' ? (
                                            <div className="space-y-2" aria-hidden="true">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: "100%" }}
                                                    transition={{ duration: 0.8, repeat: Infinity }}
                                                    className="h-1.5 bg-neutral-800"
                                                />
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: "90%" }}
                                                    transition={{ duration: 0.8, delay: 0.2, repeat: Infinity }}
                                                    className="h-1.5 bg-neutral-800"
                                                />
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: "95%" }}
                                                    transition={{ duration: 0.8, delay: 0.4, repeat: Infinity }}
                                                    className="h-1.5 bg-neutral-800"
                                                />
                                            </div>
                                        ) : (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="text-[11px] leading-relaxed text-neutral-200 font-mono"
                                            >
                                                {getGeneratedText(activeComponent).map((line, i) => (
                                                    <p key={i} className="mb-2">{line}</p>
                                                ))}
                                            </motion.div>
                                        )}

                                        {/* Module footer */}
                                        <div className="mt-4 pt-4 border-t border-neutral-800 font-mono text-[11px] text-neutral-400 flex justify-between items-center">
                                            <span className="flex items-center gap-2">
                                                <span className="uppercase">{t.features.aiDraft.visual.module}:</span>
                                                <span className="text-[var(--accent)] font-bold uppercase">{activeComponent}</span>
                                            </span>
                                            {generationState === 'completed' && (
                                                <motion.span
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className="text-[var(--accent)] font-bold"
                                                >
                                                    {t.features.aiDraft.visual.done}
                                                </motion.span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Status Footer */}
                <div className="px-5 py-3 bg-neutral-950 border-t border-neutral-800 z-20 sticky bottom-0 min-h-[48px] flex items-center">
                    <div className="flex items-center gap-3 text-neutral-300 w-full" role="status">
                        {generationState === 'generating' ? (
                            <>
                                <Loader2 className="w-4 h-4 text-[var(--accent)] animate-spin shrink-0" aria-hidden="true" />
                                <motion.span
                                    key="generating"
                                    initial={{ opacity: 0, x: 5 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="text-xs font-bold text-[var(--accent)] truncate"
                                >
                                    {t.features.aiDraft.visual.generating}
                                </motion.span>
                            </>
                        ) : generationState === 'completed' ? (
                            <>
                                <div className="w-4 h-4 bg-[var(--accent)] flex items-center justify-center shrink-0" aria-hidden="true">
                                    <Check className="w-3 h-3 text-black" />
                                </div>
                                <motion.span
                                    key="completed"
                                    initial={{ opacity: 0, x: 5 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="text-xs font-bold text-neutral-200 truncate"
                                >
                                    {t.features.aiDraft.visual.draftGenerated}
                                </motion.span>
                            </>
                        ) : (
                            <motion.span
                                key="waiting"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-xs text-neutral-400 font-bold"
                            >
                                {t.features.aiDraft.visual.initialStatus}
                            </motion.span>
                        )}
                    </div>
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
             <div className="w-56 h-72 border-2 border-black p-6 relative bg-white z-10 shadow-hard-lg">
                <div className="space-y-5" aria-hidden="true">
                    <div className="h-3 w-1/3 bg-black"></div>
                    <div className="space-y-1.5">
                        <div className="h-1.5 w-full bg-gray-300"></div>
                        <div className="h-1.5 w-full bg-gray-300"></div>
                        <div className="h-1.5 w-2/3 bg-gray-300"></div>
                    </div>
                    <div className="space-y-1.5">
                        <div className="h-1.5 w-full bg-gray-300"></div>
                        <div className="h-1.5 w-full bg-gray-300"></div>
                    </div>
                    <div className="space-y-1.5 pt-12">
                        <div className="h-1.5 w-full bg-gray-300"></div>
                        <div className="h-1.5 w-4/5 bg-gray-300"></div>
                        <div className="h-1.5 w-1/2 bg-gray-300"></div>
                    </div>
                </div>

                {/* Labels */}
                <motion.div
                    className="absolute -right-8 sm:-right-16 top-15 flex items-center gap-2"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <div className="w-6 sm:w-12 h-[2px] bg-black" aria-hidden="true"></div>
                    <span className="text-[11px] font-black font-mono uppercase bg-black text-white px-2 py-1 shadow-hard-sm">{t.features.anatomy.visual.parties}</span>
                </motion.div>

                <motion.div
                    className="absolute -left-8 sm:-left-16 top-24 flex items-center gap-2 flex-row-reverse"
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                >
                    <div className="w-6 sm:w-12 h-[2px] bg-black" aria-hidden="true"></div>
                    <span className="text-[11px] font-black font-mono uppercase bg-[var(--accent)] text-black border border-black px-2 py-1 shadow-hard-sm">{t.features.anatomy.visual.obligations}</span>
                </motion.div>

                <motion.div
                    className="absolute -right-8 sm:-right-16 bottom-16 flex items-center gap-2"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 }}
                >
                    <div className="w-6 sm:w-12 h-[2px] bg-black" aria-hidden="true"></div>
                    <span className="text-[11px] font-black font-mono uppercase bg-white border border-black text-black px-2 py-1 shadow-hard-sm">{t.features.anatomy.visual.termination}</span>
                </motion.div>
             </div>

             {/* Grid overlay */}
             <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:20px_20px]" aria-hidden="true"></div>
        </div>
    );
};

export function FeaturesShowcase() {
  const { t, language } = useLanguage();

  return (
    <section id="features" lang={language} aria-labelledby="features-title" className="scroll-mt-24 bg-white text-black py-24 lg:py-16 overflow-hidden border-b-2 border-black bg-noise relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-24 max-w-5xl mx-auto text-center">
            <h2 id="features-title" className="text-4xl sm:text-6xl font-black uppercase tracking-tight mb-8 leading-[1.1] sm:leading-[1.0] break-words hyphens-auto">
                {t.features.header.title1} <span className="relative inline-block px-3"><span className="absolute inset-0 bg-[var(--accent)] border-2 border-black shadow-hard-sm" aria-hidden="true"></span><span className="relative z-10">{t.features.header.title2}</span></span>
                <br className="hidden md:block" />
                {t.features.header.title3} <span className="inline-block border-b-8 border-black pb-2 leading-none">{t.features.header.title4}</span>
            </h2>
            <p className="text-lg md:text-xl font-mono text-black/80 max-w-3xl mx-auto leading-relaxed">
                {t.features.header.subtitle}
            </p>
        </div>

        <div className="space-y-6">
            <FeatureSection
                index={1}
                title={t.features.deadlines.title}
                subtitle={t.features.deadlines.subtitle}
                description={t.features.deadlines.description}
                align="left"
            >
                <DeadlinesVisual />
            </FeatureSection>

            <FeatureSection
                index={2}
                title={t.features.translation.title}
                subtitle={t.features.translation.subtitle}
                description={t.features.translation.description}
                align="right"
                visualClassName="h-[400px]"
            >
                <TranslationVisual />
            </FeatureSection>

            <FeatureSection
                index={3}
                title={t.features.aiDraft.title}
                subtitle={t.features.aiDraft.subtitle}
                description={t.features.aiDraft.description}
                align="left"
                visualClassName="h-[400px] md:h-[500px]"
            >
                <AIDraftVisual />
            </FeatureSection>

            <FeatureSection
                index={4}
                title={t.features.anatomy.title}
                subtitle={t.features.anatomy.subtitle}
                description={t.features.anatomy.description}
                align="right"
            >
                <AnatomyVisual />
            </FeatureSection>
        </div>
      </div>
    </section>
  );
}
