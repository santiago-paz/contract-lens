'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, AlertCircle, ArrowRight, Loader2, Sparkles, FileText, Search, Zap, Terminal } from 'lucide-react';
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
    <div className="relative pt-32 pb-20 sm:pt-48 sm:pb-32 overflow-hidden bg-white border-b-2 border-black">
        {/* Grid Background */}
        <div className="absolute inset-0 bg-grid-pattern opacity-100 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                {/* Left Column: Typography */}
                <div className="text-left max-w-2xl mx-auto lg:mx-0">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#CCFF00] border-2 border-black shadow-hard-sm mb-8"
                    >
                        <Terminal className="w-4 h-4 text-black" />
                        <span className="text-sm font-mono font-bold text-black uppercase tracking-wide">AI-Powered Contract Analysis</span>
                    </motion.div>
                    
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-6xl sm:text-8xl font-black text-black tracking-tighter mb-8 leading-[0.9]"
                    >
                        {t.hero.titleLine1} <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-black to-gray-800" style={{ WebkitTextStroke: '2px black', color: 'transparent' }}>{t.hero.titleLine2}</span>
                    </motion.h1>
                    
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-xl font-mono text-black mb-10 max-w-lg leading-relaxed border-l-4 border-[#CCFF00] pl-6"
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
                        <button className="inline-flex items-center justify-center px-8 py-4 text-base font-bold font-mono uppercase tracking-wide text-black bg-white border-2 border-black shadow-hard hover:bg-gray-50 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                            View Demo
                        </button>
                    </motion.div>
                </div>

                {/* Right Column: Industrial UI */}
                <motion.div 
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, delay: 0.4 }}
                    className="relative flex items-center justify-center"
                >
                    {/* Main Window */}
                    <div className="w-full bg-white border-2 border-black shadow-hard-lg relative">
                        {/* Title Bar */}
                        <div className="h-10 bg-black flex items-center justify-between px-3 border-b-2 border-black">
                             <div className="flex gap-2">
                                 <div className="w-3 h-3 rounded-full bg-[#CCFF00] border border-black"></div>
                                 <div className="w-3 h-3 rounded-full bg-white border border-black"></div>
                             </div>
                             <div className="text-[#CCFF00] font-mono text-xs uppercase tracking-widest">Analysis_Protocol_v2.0</div>
                             <div className="w-4"></div>
                        </div>

                        {/* Content Area */}
                        <div className="p-6 bg-white min-h-[400px] flex flex-col relative overflow-hidden">
                            {/* Grid overlay inside */}
                            <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>

                            <div className="relative z-10 space-y-6">
                                <div className="flex items-center justify-between border-b-2 border-black pb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-[#CCFF00] border-2 border-black flex items-center justify-center">
                                            <Zap className="w-6 h-6 text-black" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold font-mono uppercase text-black">Contract Intelligence</h3>
                                            <p className="text-xs font-mono text-gray-500">STATUS: ACTIVE</p>
                                        </div>
                                    </div>
                                    <div className="px-2 py-1 bg-black text-white text-xs font-mono uppercase">Live</div>
                                </div>

                                {/* Steps */}
                                <div className="space-y-4">
                                     {steps.map((step, index) => {
                                        let status: 'waiting' | 'loading' | 'done' = 'waiting';
                                        if (index < currentStep) status = 'done';
                                        else if (index === currentStep) status = 'loading';
                                        
                                        return (
                                            <div key={step} className="flex items-center gap-4 group">
                                                <div className={`
                                                    w-6 h-6 border-2 border-black flex items-center justify-center transition-all duration-0
                                                    ${status === 'done' ? 'bg-black text-[#CCFF00]' : 
                                                    status === 'loading' ? 'bg-[#CCFF00] text-black' : 'bg-white text-gray-300'}
                                                `}>
                                                    {status === 'done' ? <Check className="w-4 h-4" /> : 
                                                     status === 'loading' ? <div className="w-2 h-2 bg-black animate-pulse" /> : 
                                                     <div className="w-2 h-2 bg-gray-200" />}
                                                </div>
                                                <div className="flex-1">
                                                    <p className={`font-mono text-sm uppercase transition-colors ${status === 'waiting' ? 'text-gray-400' : 'text-black font-bold'}`}>{step}</p>
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
                                            className="bg-[#CCFF00] border-2 border-black p-4 mt-4"
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-xs font-bold font-mono uppercase tracking-wider text-black">{t.hero.card.riskTitle}</span>
                                                <span className="bg-black text-white text-[10px] font-bold px-2 py-0.5 uppercase">Critical</span>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <AlertCircle className="w-5 h-5 text-black shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="text-sm font-bold font-mono text-black leading-snug uppercase">{t.hero.card.riskText}</p>
                                                    <div className="mt-2 text-xs font-mono text-black/70">REF: Clause 4.2 // DETECTED</div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                    
                    {/* Decorative Background Elements behind the window */}
                    <div className="absolute -z-10 top-4 -right-4 w-full h-full border-2 border-black bg-gray-100"></div>
                </motion.div>
            </div>
        </div>
    </div>
  );
}
