'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, AlertCircle, ArrowRight, Loader2, Sparkles, FileText, Search, Zap } from 'lucide-react';
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
    <div className="relative pt-32 pb-20 sm:pt-48 sm:pb-32 overflow-hidden bg-white">
        {/* Abstract Background */}
        <div className="absolute top-0 inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
        <div className="absolute top-0 right-0 -z-10 h-[600px] w-[600px] bg-blue-50/50 rounded-full blur-3xl opacity-50 mix-blend-multiply filter pointer-events-none translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 -z-10 h-[600px] w-[600px] bg-purple-50/50 rounded-full blur-3xl opacity-50 mix-blend-multiply filter pointer-events-none -translate-x-1/2 translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* Left Column: Typography */}
            <div className="text-left max-w-2xl mx-auto lg:mx-0">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-50 border border-gray-200 text-sm font-medium text-gray-600 mb-6"
                >
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>AI-Powered Contract Analysis</span>
                </motion.div>
                
                <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-5xl sm:text-7xl font-bold text-gray-900 tracking-tighter mb-6 leading-[1.1]"
                >
                    {t.hero.title} <br className="hidden sm:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">{t.hero.titleHighlight}</span> {t.hero.titleEnd}
                </motion.h1>
                
                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-lg sm:text-xl text-gray-600 mb-8 max-w-lg leading-relaxed"
                >
                    {t.hero.subtitle}
                </motion.p>
                
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex flex-col sm:flex-row gap-4"
                >
                    <button
                        onClick={() => {
                            const contactForm = document.getElementById('contact-form');
                            contactForm?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="group inline-flex items-center justify-center px-8 py-4 text-base font-medium rounded-full text-white bg-black hover:bg-gray-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
                    >
                        {t.hero.cta}
                        <motion.div
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                            className="ml-2"
                        >
                            <ArrowRight className="w-4 h-4" />
                        </motion.div>
                    </button>
                    <button className="inline-flex items-center justify-center px-8 py-4 text-base font-medium rounded-full text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-all">
                        View Demo
                    </button>
                </motion.div>
            </div>

            {/* Right Column: Dynamic Visual */}
            <motion.div 
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="relative lg:h-[600px] flex items-center justify-center"
            >
                {/* Visual Container */}
                <div className="relative w-full max-w-lg perspective-1000">
                    
                    {/* Back Card: The Document */}
                    <motion.div 
                        animate={{ 
                            rotateY: -5,
                            rotateX: 5,
                            z: -50
                        }}
                        className="absolute top-0 left-8 right-8 h-[500px] bg-white border border-gray-200 rounded-2xl shadow-sm p-8 opacity-60 scale-95 origin-center"
                    >
                         <div className="w-16 h-16 bg-gray-100 rounded-lg mb-6 flex items-center justify-center">
                            <FileText className="w-8 h-8 text-gray-400" />
                         </div>
                         <div className="space-y-4">
                            <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-100 rounded w-full"></div>
                            <div className="h-4 bg-gray-100 rounded w-5/6"></div>
                            <div className="h-4 bg-gray-100 rounded w-4/5"></div>
                         </div>
                         <div className="mt-12 space-y-4">
                            <div className="h-4 bg-gray-100 rounded w-full"></div>
                            <div className="h-4 bg-gray-100 rounded w-full"></div>
                            <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                         </div>
                    </motion.div>

                    {/* Front Card: The Intelligence */}
                    <motion.div 
                        animate={{ 
                            y: [0, -10, 0],
                        }}
                        transition={{ 
                            duration: 6,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="relative bg-white/90 backdrop-blur-xl border border-white/20 shadow-2xl shadow-blue-900/10 rounded-3xl p-6 ring-1 ring-gray-900/5"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                                    <Zap className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Contract Intelligence</h3>
                                    <p className="text-xs text-gray-500">Live Analysis</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="animate-pulse w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-xs font-medium text-gray-500">Active</span>
                            </div>
                        </div>

                        {/* Analysis Steps */}
                        <div className="space-y-4 mb-8">
                             {steps.map((step, index) => {
                                let status: 'waiting' | 'loading' | 'done' = 'waiting';
                                if (index < currentStep) status = 'done';
                                else if (index === currentStep) status = 'loading';
                                
                                return (
                                    <div key={step} className="flex items-center gap-4 group">
                                        <div className={`
                                            w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300
                                            ${status === 'done' ? 'bg-green-100 text-green-600' : 
                                            status === 'loading' ? 'bg-blue-100 text-blue-600' : 'bg-gray-50 text-gray-300'}
                                        `}>
                                            {status === 'done' ? <Check className="w-4 h-4" /> : 
                                             status === 'loading' ? <Loader2 className="w-4 h-4 animate-spin" /> : 
                                             <div className="w-2 h-2 rounded-full bg-current" />}
                                        </div>
                                        <div className="flex-1">
                                            <p className={`text-sm font-medium transition-colors ${status === 'waiting' ? 'text-gray-400' : 'text-gray-900'}`}>{step}</p>
                                        </div>
                                        {status === 'loading' && (
                                            <motion.div 
                                                layoutId="active-pill"
                                                className="w-1.5 h-1.5 bg-blue-600 rounded-full"
                                            />
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Result Card (Slide up) */}
                        <AnimatePresence>
                            {showResults && (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="bg-gray-50 rounded-2xl p-4 border border-gray-100 overflow-hidden"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">{t.hero.card.riskTitle}</span>
                                        <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full">HIGH PRIORITY</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 leading-snug">{t.hero.card.riskText}</p>
                                            <div className="mt-2 text-xs text-gray-500">Detected in Clause 4.2</div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </motion.div>
        </div>
      </div>
    </div>
  );
}
