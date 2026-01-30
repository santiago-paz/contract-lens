'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, ArrowRight, Check, Command, FileText, Loader2, Terminal } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLanguage } from './LanguageContext';

export function Hero() {
    const { t } = useLanguage();
    const [currentStep, setCurrentStep] = useState(0);
    const [showResults, setShowResults] = useState(false);

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
        <div className="relative pt-32 pb-20 sm:pt-48 sm:pb-32 overflow-hidden bg-white border-b-2 border-black bg-noise">
            {/* Grid Background */}
            <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
                    {/* Left Column: Typography */}
                    <div className="text-left max-w-4xl mx-auto lg:mx-0">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="inline-flex max-w-full items-center gap-3 px-4 py-2 bg-[#CCFF00] border-2 border-black shadow-hard-sm mb-8 hover:-translate-y-1 transition-transform cursor-default"
                        >
                            <Terminal className="w-4 h-4 text-black shrink-0" />
                            <span className="text-sm font-mono font-bold text-black uppercase tracking-wide truncate sm:whitespace-normal sm:overflow-visible">{t.hero.badge}</span>
                            <div className="w-1.5 h-1.5 bg-black animate-pulse shrink-0" />
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-6xl sm:text-7xl md:text-8xl font-black text-black tracking-tighter mb-8 leading-[0.85] break-words hyphens-auto"
                        >
                            {t.hero.titleLine1} <br />
                            <span className="relative inline-block">
                                <span className="absolute inset-0 bg-black skew-x-[-2deg] opacity-0"></span>
                                <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-black to-gray-800" style={{ WebkitTextStroke: '2px black', color: 'transparent' }}>
                                    {t.hero.titleLine2}
                                </span>
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-xl md:text-2xl font-mono text-black mb-12 max-w-lg leading-relaxed border-l-4 border-[#CCFF00] pl-6"
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
                                onClick={() => {
                                    const contactForm = document.getElementById('contact-form');
                                    contactForm?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="group inline-flex items-center justify-center px-8 py-4 text-base font-bold font-mono uppercase tracking-wide bg-black text-white border-2 border-black shadow-hard hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all active:bg-[#CCFF00] active:text-black"
                            >
                                {t.hero.cta}
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button className="group inline-flex items-center justify-center px-8 py-4 text-base font-bold font-mono uppercase tracking-wide text-black bg-white border-2 border-black shadow-hard hover:bg-black hover:text-[#CCFF00] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                                {t.hero.seeSystem}
                                <Command className="ml-2 w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                        </motion.div>
                    </div>

                    {/* Right Column: Industrial UI */}
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
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-[#CCFF00] border border-black hover:bg-red-500 transition-colors cursor-pointer"></div>
                                    <div className="w-3 h-3 rounded-full bg-white border border-black hover:bg-yellow-400 transition-colors cursor-pointer"></div>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div className="text-[#CCFF00] font-mono text-xs uppercase tracking-widest font-bold">ASSET_OS_KERNEL</div>
                                    <div className="text-gray-500 font-mono text-[9px] uppercase tracking-wider">PID: 8821 // ROOT</div>
                                </div>
                                <div className="w-8"></div>
                            </div>

                            {/* Content Area */}
                            <div className="p-8 bg-white min-h-[450px] flex flex-col relative overflow-hidden">
                                {/* Grid overlay inside */}
                                <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>

                                <div className="relative z-10 space-y-8">
                                    <div className="flex flex-wrap items-center justify-between border-b-2 border-black pb-6 gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="relative w-20 h-20 bg-white border-2 border-black flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                                                <FileText className="w-8 h-8 text-black" />
                                                {!showResults && (
                                                    <motion.div
                                                        className="absolute top-0 left-0 w-full h-1 bg-[#CCFF00] shadow-[0_0_15px_4px_rgba(204,255,0,0.5)] z-10"
                                                        animate={{ top: ['0%', '100%', '0%'] }}
                                                        transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                                                    />
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse shrink-0" />
                                                    <h3 className="font-bold font-mono uppercase text-black text-lg truncate">FORENSIC AUDIT</h3>
                                                </div>
                                                <p className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 inline-block border border-gray-200 break-all max-w-full">{t.hero.target}: SERVICE_AGREEMENT_2024.PDF</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-1 shrink-0">
                                            <div className="px-3 py-1 bg-black text-[#CCFF00] text-xs font-mono uppercase font-bold tracking-wider">Live Monitor</div>
                                            <span className="text-[10px] font-mono text-gray-400">{t.hero.latency}: 12ms</span>
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
                                                            status === 'loading' ? 'bg-[#CCFF00] text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 'bg-white text-gray-300'}
                                                `}>
                                                        <AnimatePresence mode="wait">
                                                            {status === 'done' ? (
                                                                <motion.div
                                                                    key="check"
                                                                    initial={{ scale: 0 }}
                                                                    animate={{ scale: 1 }}
                                                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                                                >
                                                                    <Check className="w-5 h-5" />
                                                                </motion.div>
                                                            ) : status === 'loading' ? (
                                                                <motion.div
                                                                    key="loading"
                                                                    animate={{ rotate: 360 }}
                                                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                                >
                                                                    <Loader2 className="w-5 h-5" />
                                                                </motion.div>
                                                            ) : (
                                                                <div key="dot" className="w-2 h-2 bg-gray-200" />
                                                            )}
                                                        </AnimatePresence>
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className={`font-mono text-sm uppercase transition-all duration-300 ${status === 'waiting' ? 'text-gray-400' :
                                                                status === 'loading' ? 'text-black font-black tracking-wider' :
                                                                    'text-black font-bold'
                                                            }`}>{step}</p>
                                                        {status === 'loading' && (
                                                            <motion.div
                                                                initial={{ width: 0 }}
                                                                animate={{ width: "100%" }}
                                                                className="h-1 bg-black mt-1 max-w-[100px]"
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
                                                <div className="absolute top-0 right-0 p-1 opacity-20">
                                                    <AlertCircle className="w-16 h-16" />
                                                </div>
                                                <div className="flex items-center justify-between mb-2 relative z-10">
                                                    <span className="text-xs font-bold font-mono uppercase tracking-wider text-black">{t.hero.card.riskTitle}</span>
                                                    <span className="bg-black text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-widest animate-pulse">CRITICAL</span>
                                                </div>
                                                <div className="flex items-start gap-3 relative z-10">
                                                    <AlertCircle className="w-5 h-5 text-black fill-transparent stroke-2 shrink-0 mt-0.5" />
                                                    <div>
                                                        <p className="text-sm font-bold font-mono text-black leading-snug uppercase">{t.hero.card.riskText}</p>
                                                        <div className="mt-2 text-xs font-mono text-black/70 flex items-center gap-2">
                                                            <span>REF: Clause 4.2</span>
                                                            <span className="w-1 h-1 bg-black rounded-full" />
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
                        <div className="hidden sm:block absolute -z-10 top-6 -right-6 w-full h-full border-2 border-black bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] bg-gray-50 opacity-50"></div>
                        <div className="sm:hidden absolute -z-10 top-3 -right-3 w-full h-full border-2 border-black bg-gray-100"></div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
