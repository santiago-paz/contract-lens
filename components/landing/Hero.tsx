'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { AlertCircle, ArrowRight, Check, FileText, Loader2, Play, Terminal } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLanguage } from './LanguageContext';
import { scrollToSection } from './scroll';

export function Hero() {
    const { t } = useLanguage();
    const [currentStep, setCurrentStep] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const reduceMotion = useReducedMotion();

    // Use translations for steps
    const steps = t.hero.analysisSteps;

    useEffect(() => {
        let timeout: NodeJS.Timeout;

        const runAnimation = () => {
            // Step 0: Start
            setCurrentStep(0);
            setShowResults(false);

            // Step 1: Move to Partner Validation
            timeout = setTimeout(() => {
                setCurrentStep(1);
            }, 1500);

            // Step 2: Move to Extracting Metadata
            timeout = setTimeout(() => {
                setCurrentStep(2);
            }, 3000);

            // Step 3: Finish Extraction, Show Results
            timeout = setTimeout(() => {
                setCurrentStep(3); // All done
                setShowResults(true);
            }, 4500);
        };

        runAnimation();

        return () => clearTimeout(timeout);
    }, []);

    return (
        <section className="relative pt-32 pb-20 sm:pt-48 sm:pb-32 overflow-hidden bg-white border-b-2 border-black bg-noise">
            {/* Grid Background */}
            <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none" aria-hidden="true"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
                    {/* Left Column: Typography */}
                    <div className="text-left max-w-4xl mx-auto lg:mx-0">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="inline-flex max-w-full items-center gap-3 px-4 py-2 bg-[#CCFF00] border-2 border-black shadow-hard-sm mb-8"
                        >
                            <Terminal className="w-4 h-4 text-black shrink-0" aria-hidden="true" />
                            <span className="text-sm font-mono font-bold text-black uppercase tracking-wide truncate sm:whitespace-normal sm:overflow-visible">{t.hero.badge}</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-5xl sm:text-6xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-black text-black tracking-tight mb-8 leading-[1.05] break-words hyphens-auto"
                        >
                            {t.hero.titleLine1} <br />
                            <span className="inline-block border-b-8 border-[#CCFF00] pb-1">
                                {t.hero.titleLine2}
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-lg md:text-xl font-mono text-black mb-12 max-w-lg leading-relaxed border-l-4 border-[#CCFF00] pl-6"
                        >
                            {t.hero.subtitle}
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="flex flex-col sm:flex-row gap-6"
                        >
                            <button
                                onClick={() => scrollToSection('contact-form')}
                                className="group inline-flex items-center justify-center px-8 py-4 text-base font-bold font-mono uppercase tracking-wide bg-black text-white border-2 border-black shadow-hard hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all active:bg-[#CCFF00] active:text-black"
                            >
                                {t.hero.cta}
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                            </button>
                            <button
                                onClick={() => scrollToSection('how-it-works')}
                                className="group inline-flex items-center justify-center px-8 py-4 text-base font-bold font-mono uppercase tracking-wide text-black bg-white border-2 border-black shadow-hard hover:bg-black hover:text-[#CCFF00] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                            >
                                {t.hero.seeSystem}
                                <Play className="ml-2 w-4 h-4" aria-hidden="true" />
                            </button>
                        </motion.div>
                    </div>

                    {/* Right Column: Analysis Window */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, delay: 0.4 }}
                        className="relative flex items-center justify-center mt-12 lg:mt-0"
                    >
                        {/* Main Window */}
                        <div className="w-full bg-white border-2 border-black shadow-hard-lg relative z-10">
                            {/* Title Bar */}
                            <div className="h-12 bg-black flex items-center justify-between px-4 border-b-2 border-black">
                                <div className="flex gap-2" aria-hidden="true">
                                    <div className="w-3 h-3 rounded-full bg-[#CCFF00] border border-black"></div>
                                    <div className="w-3 h-3 rounded-full bg-white border border-black"></div>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div className="text-[#CCFF00] font-mono text-xs uppercase tracking-widest font-bold">CONTRACT_LENS</div>
                                    <div className="text-gray-400 font-mono text-[11px] uppercase tracking-wider">{t.hero.encryptedTag}</div>
                                </div>
                                <div className="w-8" aria-hidden="true"></div>
                            </div>

                            {/* Content Area */}
                            <div className="p-8 bg-white min-h-[450px] flex flex-col relative overflow-hidden">
                                {/* Grid overlay inside */}
                                <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" aria-hidden="true"></div>

                                <div className="relative z-10 space-y-8">
                                    <div className="flex flex-wrap items-center justify-between border-b-2 border-black pb-6 gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="relative w-20 h-20 bg-white border-2 border-black flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                                                <FileText className="w-8 h-8 text-black" aria-hidden="true" />
                                                {!showResults && !reduceMotion && (
                                                    <motion.div
                                                        className="absolute top-0 left-0 w-full h-1 bg-[#CCFF00] shadow-[0_0_15px_4px_rgba(204,255,0,0.5)] z-10"
                                                        animate={{ top: ['0%', '100%', '0%'] }}
                                                        transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                                                        aria-hidden="true"
                                                    />
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="w-2 h-2 bg-black shrink-0" aria-hidden="true" />
                                                    <p className="font-bold font-mono uppercase text-black text-lg truncate">{t.hero.reviewTitle}</p>
                                                </div>
                                                <p className="text-xs font-mono text-gray-700 bg-gray-100 px-2 py-1 inline-block border border-gray-300 break-all max-w-full">{t.hero.target}: SERVICE_AGREEMENT_2024.PDF</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-1 shrink-0">
                                            <div className="px-3 py-1 bg-black text-[#CCFF00] text-xs font-mono uppercase font-bold tracking-wider">{t.hero.liveMonitor}</div>
                                        </div>
                                    </div>

                                    {/* Steps */}
                                    <div className="space-y-5">
                                        {steps.map((step, index) => {
                                            let status: 'waiting' | 'loading' | 'done' = 'waiting';
                                            if (index < currentStep) status = 'done';
                                            else if (index === currentStep) status = 'loading';

                                            return (
                                                <div key={step} className="flex items-center gap-5 group">
                                                    <div className={`
                                                    w-8 h-8 border-2 border-black flex items-center justify-center transition-all duration-300
                                                    ${status === 'done' ? 'bg-black text-[#CCFF00]' :
                                                            status === 'loading' ? 'bg-[#CCFF00] text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 'bg-white text-gray-400'}
                                                `}>
                                                        <AnimatePresence mode="wait">
                                                            {status === 'done' ? (
                                                                <motion.div
                                                                    key="check"
                                                                    initial={{ scale: 0 }}
                                                                    animate={{ scale: 1 }}
                                                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                                                >
                                                                    <Check className="w-5 h-5" aria-hidden="true" />
                                                                </motion.div>
                                                            ) : status === 'loading' ? (
                                                                <motion.div
                                                                    key="loading"
                                                                    animate={reduceMotion ? undefined : { rotate: 360 }}
                                                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                                >
                                                                    <Loader2 className="w-5 h-5" aria-hidden="true" />
                                                                </motion.div>
                                                            ) : (
                                                                <div key="dot" className="w-2 h-2 bg-gray-300" aria-hidden="true" />
                                                            )}
                                                        </AnimatePresence>
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className={`font-mono text-sm uppercase transition-all duration-300 ${status === 'waiting' ? 'text-gray-500' : 'text-black font-bold'
                                                            }`}>{step}</p>
                                                        {status === 'loading' && (
                                                            <motion.div
                                                                initial={{ width: 0 }}
                                                                animate={{ width: "100%" }}
                                                                className="h-1 bg-black mt-1 max-w-[100px]"
                                                                aria-hidden="true"
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Result Box */}
                                    <AnimatePresence>
                                        {showResults && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                className="bg-[#CCFF00] border-2 border-black p-4 mt-4 relative overflow-hidden"
                                            >
                                                <div className="absolute top-0 right-0 p-1 opacity-15" aria-hidden="true">
                                                    <AlertCircle className="w-16 h-16" />
                                                </div>
                                                <div className="flex items-center justify-between mb-2 relative z-10">
                                                    <span className="text-xs font-bold font-mono uppercase tracking-wider text-black">{t.hero.card.riskTitle}</span>
                                                    <span className="bg-black text-white text-[11px] font-bold px-2 py-0.5 uppercase tracking-widest">{t.hero.card.riskBadge}</span>
                                                </div>
                                                <div className="flex items-start gap-3 relative z-10">
                                                    <AlertCircle className="w-5 h-5 text-black fill-transparent stroke-2 shrink-0 mt-0.5" aria-hidden="true" />
                                                    <div>
                                                        <p className="text-sm font-bold font-mono text-black leading-snug">{t.hero.card.riskText}</p>
                                                        <div className="mt-2 text-xs font-mono text-black/80 flex items-center gap-2">
                                                            <span>§ 4.2</span>
                                                            <span className="w-1 h-1 bg-black rounded-full" aria-hidden="true" />
                                                            <span className="font-bold">{t.hero.detected}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>

                        {/* Decorative Background Elements behind the window */}
                        <div className="hidden sm:block absolute -z-10 top-6 -right-6 w-full h-full border-2 border-black bg-[url('/graphy.png')] bg-gray-50 opacity-50" aria-hidden="true"></div>
                        <div className="sm:hidden absolute -z-10 top-3 -right-3 w-full h-full border-2 border-black bg-gray-100" aria-hidden="true"></div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
