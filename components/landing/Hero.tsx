'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
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
      }, 800);

      // Step 2: Move to Extracting Metadata
      timeout = setTimeout(() => {
        setCurrentStep(2);
      }, 1600);

      // Step 3: Finish Extraction, Show Results
      timeout = setTimeout(() => {
        setCurrentStep(3); // All done
        setShowResults(true);
      }, 2400);

      // Step 4: Reset after showing results for a while
      timeout = setTimeout(() => {
        runAnimation();
      }, 6000); 
    };

    runAnimation();

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl sm:text-6xl font-bold text-gray-900 tracking-tight mb-6"
          >
            {t.hero.title} <br className="hidden sm:block" />
            <span className="text-blue-600">{t.hero.titleHighlight}</span> {t.hero.titleEnd}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
          >
            {t.hero.subtitle}
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={() => {
                const contactForm = document.getElementById('contact-form');
                contactForm?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
            >
              {t.hero.cta}
              <ArrowRight className="ml-2 w-4 h-4" />
            </button>
          </motion.div>
        </div>

        {/* Split Screen Visual */}
        <div className="relative mt-20 lg:grid lg:grid-cols-2 lg:gap-8 items-center max-w-6xl mx-auto">
            {/* Left: The Problem (Blurry PDF) */}
            <motion.div 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="relative hidden lg:block"
            >
                {/* Background glow removed for cleaner light mode */}
                <div className="relative bg-white border border-gray-200 rounded-lg p-6 h-[450px] overflow-hidden shadow-sm scale-95 origin-right group">
                    {/* Scanning Line - One-time noticeable scan */}
                    <motion.div 
                        className="absolute left-0 right-0 h-2 bg-blue-500/30 z-20 shadow-[0_0_15px_rgba(59,130,246,0.6)] border-b border-blue-500/60"
                        initial={{ top: "-10%" }}
                        whileInView={{ top: "120%" }} // Trigger on view
                        viewport={{ once: true }} // Only run once
                        transition={{ 
                            duration: 2.5, 
                            ease: "easeInOut",
                            delay: 0.5 
                        }}
                    >
                        {/* Gradient trail behind the scan line */}
                        <div className="absolute bottom-full left-0 right-0 h-20 bg-gradient-to-t from-blue-500/10 to-transparent"></div>
                    </motion.div>

                    {/* Badge at top right */}
                    <div className="absolute top-4 right-4 z-20">
                        <div className="bg-red-50 text-red-600 px-3 py-1 rounded-md border border-red-100 font-mono text-xs font-medium shadow-sm">
                            {t.hero.raw}
                        </div>
                    </div>

                    {/* Fake PDF Content - Less Blurry to show "messy" data */}
                    <div className="space-y-4 opacity-60 blur-[1px] pointer-events-none select-none mt-8 font-mono text-[10px] leading-tight text-gray-400 overflow-hidden">
                        <p>MASTER SERVICES AGREEMENT</p>
                        <p>THIS AGREEMENT is made on [DATE] between [PARTY A] and [PARTY B]...</p>
                        <div className="h-4"></div>
                        <p className="w-full break-words">
                           loremipsumdolorsitametconsecteturadipiscingelitseddoeiusmodtemporincididuntutlaboreetdoloremagnaaliquautennimadminimveniamquisnostrudexercitationullamcolaborisnisiutaliquipexeacommodoconsequat.
                        </p>
                        <p>SECTION 2.1 - TERMINATION CLAUSE</p>
                        <p className="w-full break-words opacity-80">
                           Thecontractshallautomaticallyrenewforasuccessivetermof12monthsunlesswrittennoticeisprovidedatleast30dayspriortotheexpirationofthecurrentterm.Failuretoprovidesuchnoticewillresultinautomaticrenewal.
                        </p>
                        <div className="h-4"></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="border border-gray-300 p-2">
                                <p>FEES</p>
                                <p>$120,000/yr</p>
                            </div>
                             <div className="border border-gray-300 p-2">
                                <p>PAYMENT</p>
                                <p>NET30</p>
                            </div>
                        </div>
                         <p className="w-full break-words mt-4">
                           confidentialinformationmeansanydataorinformationproprietarytothepartydisclosingitwhetherinwritingororalformthatismarkedasconfidentialorwouldreasonablybeunderstoodtobeconfidential.
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Connecting Arrow */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 hidden lg:block text-blue-600">
                <ArrowRight className="w-8 h-8 animate-pulse" />
            </div>

            {/* Right: The Solution (Clean UI Card) */}
            <motion.div 
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.5 }}
                className="relative"
            >
                {/* Subtle shadow instead of glow */}
                <div className="relative bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200 min-h-[280px]">
                    {/* Header */}
                    <div className="border-b border-gray-100 bg-gray-50/50 p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#FF9900] rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-sm">AWS</div>
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900">{t.hero.card.vendor}</h3>
                                <p className="text-xs text-gray-500">{t.hero.card.type}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                {t.hero.card.status}
                            </span>
                        </div>
                    </div>

                    {/* Content Body */}
                    <div className="p-6 space-y-6">
                        <AnimatePresence mode="wait">
                            {showResults ? (
                                <motion.div 
                                    key="results"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-6"
                                >
                                    {/* Extracted Fields */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">{t.hero.card.valueLabel}</label>
                                            <div className="text-sm font-medium text-gray-900">{t.hero.card.value}</div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">{t.hero.card.dateLabel}</label>
                                            <div className="text-sm font-medium text-gray-900">{t.hero.card.date}</div>
                                        </div>
                                    </div>

                                    {/* Renewal Alert */}
                                    <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-3">
                                        <div className="p-2 bg-white rounded-full border border-red-100 shadow-sm animate-pulse">
                                            <AlertCircle className="w-5 h-5 text-red-500" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-semibold text-gray-900">{t.hero.card.riskTitle}</h4>
                                            <p className="text-xs text-gray-600 mt-0.5">{t.hero.card.riskText}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-100 px-3 py-2 rounded-lg text-sm w-fit">
                                        <Check className="w-4 h-4" />
                                        <span>{t.hero.card.complete}</span>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div 
                                    key="loading"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="space-y-3 pt-2"
                                >
                                    {steps.map((step, index) => {
                                        let status: 'waiting' | 'loading' | 'done' = 'waiting';
                                        if (index < currentStep) status = 'done';
                                        else if (index === currentStep) status = 'loading';
                                        
                                        return (
                                            <div key={step} className="flex items-center gap-3 text-sm transition-all duration-300">
                                                <div className={`
                                                    w-5 h-5 rounded-full flex items-center justify-center transition-colors duration-300
                                                    ${status === 'done' ? 'bg-green-500 text-white' : 
                                                    status === 'loading' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-gray-100 text-gray-400'}
                                                `}>
                                                    {status === 'done' ? (
                                                        <Check className="w-3 h-3" />
                                                    ) : status === 'loading' ? (
                                                        <Loader2 className="w-3 h-3 animate-spin" />
                                                    ) : (
                                                        <div className="w-1.5 h-1.5 rounded-full bg-current" />
                                                    )}
                                                </div>
                                                <span className={`
                                                    transition-colors duration-300
                                                    ${status === 'loading' ? 'text-gray-900 font-medium' : 
                                                    status === 'done' ? 'text-gray-700' : 'text-gray-400'}
                                                `}>
                                                    {step}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Floating Elements for effect - Only show when results are visible */}
                <AnimatePresence>
                    {showResults && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ 
                                opacity: { duration: 0.3 },
                                y: { duration: 4, repeat: Infinity, ease: "easeInOut" } 
                            }}
                            className="absolute -right-8 top-12 bg-white rounded-lg shadow-xl p-3 border border-gray-100 hidden sm:block"
                        >
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                <div className="text-xs font-medium text-gray-700">{t.hero.card.verified}</div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
      </div>
      
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 right-0 h-[600px] bg-gradient-to-b from-blue-50/50 to-transparent -z-10 pointer-events-none"></div>
    </div>
  );
}
