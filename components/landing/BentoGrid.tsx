'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Check, Loader2, FileText, Bell, Users, Zap, Shield, AlertTriangle } from 'lucide-react';
import { useLanguage } from './LanguageContext';

export function BentoGrid() {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const runAnimation = () => {
      // Step 0: Start
      setCurrentStep(0);

      // Step 1: Partner ID
      timeout = setTimeout(() => {
        setCurrentStep(1);
      }, 2000);

      // Step 2: Date Extraction
      timeout = setTimeout(() => {
        setCurrentStep(2);
      }, 4500);

      // Step 3: Finish, show validating
      timeout = setTimeout(() => {
        setCurrentStep(3);
      }, 7000);

      // Step 4: Show Results
      timeout = setTimeout(() => {
        setCurrentStep(4);
      }, 9500);

      // Reset
      timeout = setTimeout(() => {
        runAnimation();
      }, 14000);
    };

    runAnimation();

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div id="bento-grid" className="py-20 sm:py-32 relative bg-white border-b-2 border-black overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-100 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-left mb-16 sm:mb-24 max-w-3xl">
          <h2 className="text-4xl sm:text-6xl font-black text-black tracking-tighter mb-6 uppercase">
            {t.bento.title}
          </h2>
          <p className="text-xl font-mono text-black leading-relaxed border-l-4 border-[#CCFF00] pl-6 bg-white inline-block pr-4">
            {t.bento.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 sm:gap-8 auto-rows-[minmax(350px,auto)]">
          {/* Card 1: Ingestion Wizard - Large span */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-4 bg-white border-2 border-black shadow-hard p-8 sm:p-10 relative group"
          >
            <div className="relative z-10 flex flex-col h-full">
                <div className="mb-8">
                    <div className="w-12 h-12 bg-[#CCFF00] border-2 border-black flex items-center justify-center mb-6 shadow-hard-sm">
                        <Zap className="w-6 h-6 text-black" />
                    </div>
                    <h3 className="text-2xl font-bold font-mono text-black mb-3 uppercase">{t.bento.ingestion.title}</h3>
                    <p className="text-black font-mono text-sm max-w-md">
                        {t.bento.ingestion.description}
                    </p>
                </div>

                {/* Mock UI */}
                <div className="mt-auto bg-white border-2 border-black shadow-hard-sm p-6 max-w-lg w-full mx-auto h-[280px] flex flex-col justify-center relative">
                    {/* Header bar */}
                    <div className="absolute top-0 left-0 right-0 h-8 bg-black flex items-center px-2 justify-between">
                         <span className="text-white font-mono text-[10px] uppercase">DATA_INGESTION_STREAM</span>
                         <div className="flex gap-1">
                             <div className="w-2 h-2 bg-[#CCFF00]"></div>
                             <div className="w-2 h-2 bg-white"></div>
                         </div>
                    </div>
                    
                    <div className="mt-6">
                    <AnimatePresence mode="wait">
                        {currentStep < 4 ? (
                            <motion.div 
                                key="processing"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-5"
                            >
                                <div className="flex items-center justify-between border-b-2 border-gray-100 pb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-gray-100 border border-black flex items-center justify-center">
                                            <FileText className="w-4 h-4 text-black" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold font-mono text-black">MASTER_SERVICE_AGREEMENT_V1.PDF</div>
                                            <div className="text-xs font-mono text-gray-500">2.4 MB</div>
                                        </div>
                                    </div>
                                    <span className={`text-xs font-bold font-mono px-2 py-1 border border-black ${
                                        currentStep === 3 ? 'bg-[#CCFF00] text-black' : 'bg-gray-100 text-black'
                                    }`}>
                                        {currentStep === 3 ? 'VERIFIED' : 'ANALYZING'}
                                    </span>
                                </div>
                                <div className="space-y-3">
                                    {['Analysis', 'Partner ID', 'Extraction'].map((step, i) => {
                                        let status: 'waiting' | 'loading' | 'done' = 'waiting';
                                        if (i < currentStep) status = 'done';
                                        else if (i === currentStep) status = 'loading';

                                        return (
                                            <div key={i} className="flex items-center justify-between group/step">
                                                <span className={`text-sm font-mono font-bold uppercase transition-colors ${status === 'waiting' ? 'text-gray-300' : 'text-black'}`}>{step}</span>
                                                <div className="flex items-center gap-3">
                                                    {status === 'loading' && (
                                                        <span className="text-xs text-black font-mono animate-pulse">Running...</span>
                                                    )}
                                                    <div className={`
                                                        w-4 h-4 flex items-center justify-center border border-black transition-all duration-0
                                                        ${status === 'done' ? 'bg-black text-[#CCFF00]' : 
                                                        status === 'loading' ? 'bg-[#CCFF00]' : 'bg-white'}
                                                    `}>
                                                        {status === 'done' && <Check className="w-3 h-3" />}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="results"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="space-y-4"
                            >
                                <div className="flex items-center gap-2 mb-4 bg-[#CCFF00] px-3 py-1.5 border border-black w-fit shadow-[2px_2px_0px_0px_#000]">
                                    <Check className="w-4 h-4 text-black" />
                                    <span className="text-xs font-bold font-mono uppercase tracking-wide text-black">{t.bento.ingestion.results.title}</span>
                                </div>
                                
                                <div className="p-4 bg-gray-50 border border-black">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-sm font-bold font-mono text-black uppercase">{t.bento.ingestion.results.vendor}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-mono text-gray-600">{t.bento.ingestion.results.value}</span>
                                    </div>
                                </div>
                                <div className="p-4 bg-gray-50 border border-black">
                                    <p className="text-xs font-mono text-black leading-relaxed uppercase">
                                        {t.bento.ingestion.results.summaryText}
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    </div>
                </div>
            </div>
          </motion.div>

          {/* Card 2: Proactive Guard - Alert */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="md:col-span-2 bg-black text-white p-8 sm:p-10 relative overflow-hidden group border-2 border-black shadow-hard"
          >
             <div className="relative z-10 flex flex-col h-full">
                <div className="mb-8">
                    <div className="w-12 h-12 bg-white/10 border border-white/20 flex items-center justify-center mb-6">
                        <Shield className="w-6 h-6 text-[#CCFF00]" />
                    </div>
                    <h3 className="text-2xl font-bold font-mono text-white mb-3 uppercase">{t.bento.guard.title}</h3>
                    <p className="text-gray-400 font-mono text-xs leading-relaxed uppercase">
                        {t.bento.guard.description}
                    </p>
                </div>

                <div className="mt-auto space-y-3 relative">
                    {/* Alert 1 */}
                    <div className="relative group/alert">
                        <div className="bg-white/5 border border-white/20 p-4 flex items-center gap-4 transition-colors hover:bg-white/10">
                            <div className="w-8 h-8 bg-red-500/20 flex items-center justify-center shrink-0 border border-red-500">
                                <Bell className="w-4 h-4 text-red-500 fill-red-500" />
                            </div>
                            <div>
                                <p className="text-sm font-bold font-mono text-white uppercase">{t.bento.guard.alert1}</p>
                                <p className="text-[10px] font-mono text-gray-400 uppercase">{t.bento.guard.alert1Sub}</p>
                            </div>
                        </div>
                    </div>

                    {/* Alert 2 */}
                    <div className="relative group/alert">
                        <div className="bg-white/5 border border-white/20 p-4 flex items-center gap-4 transition-colors hover:bg-white/10">
                            <div className="w-8 h-8 bg-blue-500/20 flex items-center justify-center shrink-0 border border-blue-500">
                                <FileText className="w-4 h-4 text-blue-500 fill-blue-500" />
                            </div>
                            <div>
                                <p className="text-sm font-bold font-mono text-white uppercase">{t.bento.guard.alert2}</p>
                                <p className="text-[10px] font-mono text-gray-400 uppercase">{t.bento.guard.alert2Sub}</p>
                            </div>
                        </div>
                    </div>

                    {/* Alert 3 */}
                    <div className="relative group/alert">
                        <div className="bg-white/5 border border-white/20 p-4 flex items-center gap-4 opacity-80 hover:opacity-100 transition-opacity">
                             <div className="w-8 h-8 bg-amber-500/20 flex items-center justify-center shrink-0 border border-amber-500">
                                <AlertTriangle className="w-4 h-4 text-amber-500 fill-amber-500" />
                            </div>
                            <div>
                                <p className="text-sm font-bold font-mono text-white uppercase">{t.bento.guard.alert3}</p>
                                <p className="text-[10px] font-mono text-gray-400 uppercase">{t.bento.guard.alert3Sub}</p>
                            </div>
                        </div>
                    </div>

                    {/* Alert 4 */}
                    <div className="relative group/alert">
                        <div className="bg-white/5 border border-white/20 p-4 flex items-center gap-4 opacity-60 hover:opacity-100 transition-opacity">
                             <div className="w-8 h-8 bg-[#CCFF00]/20 flex items-center justify-center shrink-0 border border-[#CCFF00]">
                                <Users className="w-4 h-4 text-[#CCFF00] fill-[#CCFF00] stroke-black" />
                            </div>
                            <div>
                                <p className="text-sm font-bold font-mono text-white uppercase">{t.bento.guard.alert4}</p>
                                <p className="text-[10px] font-mono text-gray-400 uppercase">{t.bento.guard.alert4Sub}</p>
                            </div>
                        </div>
                    </div>
                </div>
             </div>
          </motion.div>

          {/* Card 3: Partner & Task Management - Full Width */}
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="md:col-span-6 bg-white border-2 border-black shadow-hard p-8 sm:p-12 overflow-hidden relative"
          >
             <div className="grid md:grid-cols-2 gap-16 items-center relative z-10">
                <div>
                     <div className="w-12 h-12 bg-black flex items-center justify-center mb-6 shadow-hard-sm">
                        <Users className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold font-mono text-black mb-4 uppercase">{t.bento.collab.title}</h3>
                    <p className="text-lg font-mono text-gray-600 mb-8 leading-relaxed">
                        {t.bento.collab.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-3">
                        {t.bento.collab.list.map((item, i) => (
                            <span key={i} className="inline-flex items-center gap-2 bg-[#CCFF00] px-4 py-2 border border-black text-sm font-bold font-mono text-black uppercase shadow-[2px_2px_0px_0px_#000]">
                                <Check className="w-4 h-4 text-black" />
                                {item}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Visuals Side */}
                <div className="relative">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                        <div className="space-y-4">
                             {/* Partner Card 1 */}
                            <div className="bg-white p-5 border-2 border-black shadow-hard-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-8 h-8 bg-blue-600 border border-black flex items-center justify-center text-white font-bold font-mono text-lg">G</div>
                                    <div>
                                        <div className="text-sm font-bold font-mono text-black uppercase">Google LLC</div>
                                        <div className="text-[10px] font-mono text-gray-500 uppercase">Service Provider</div>
                                    </div>
                                </div>
                                <div className="h-2 w-full bg-gray-100 border border-black">
                                    <div className="h-full bg-[#CCFF00] w-3/4 border-r border-black"></div>
                                </div>
                            </div>
                            
                             {/* Task Card 1 */}
                             <div className="bg-gray-50 p-5 border-2 border-black opacity-80">
                                <div className="flex items-center justify-between mb-2">
                                   <div className="flex -space-x-2">
                                       <div className="w-6 h-6 bg-black border border-white"></div>
                                       <div className="w-6 h-6 bg-gray-500 border border-white"></div>
                                   </div>
                                   <span className="text-[10px] font-bold font-mono text-red-600 uppercase border border-red-600 px-1">{t.bento.collab.taskCard.due}</span>
                                </div>
                                <p className="text-sm font-bold font-mono text-black uppercase">{t.bento.collab.taskCard.task.replace(/"/g, '')}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {/* Partner Card 2 */}
                            <div className="bg-white p-5 border-2 border-black shadow-hard-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-8 h-8 bg-black border border-black flex items-center justify-center text-white font-bold font-mono text-lg">S</div>
                                    <div>
                                        <div className="text-sm font-bold font-mono text-black uppercase">Salesforce</div>
                                        <div className="text-[10px] font-mono text-gray-500 uppercase">CRM Platform</div>
                                    </div>
                                </div>
                                <div className="flex gap-2 text-xs">
                                     <span className="bg-blue-50 border border-blue-200 text-blue-700 px-2 py-1 font-bold font-mono uppercase">Auto-Renew</span>
                                </div>
                            </div>

                            {/* Task Card 2 */}
                             <div className="bg-gray-50 p-5 border-2 border-black opacity-80">
                                <div className="flex items-center justify-between mb-2">
                                   <div className="flex -space-x-2">
                                       <div className="w-6 h-6 bg-[#CCFF00] border border-black"></div>
                                       <div className="w-6 h-6 bg-white border border-black"></div>
                                   </div>
                                   <span className="text-[10px] font-bold font-mono text-orange-600 uppercase border border-orange-600 px-1">{t.bento.collab.taskCard2.due}</span>
                                </div>
                                <p className="text-sm font-bold font-mono text-black uppercase">{t.bento.collab.taskCard2.task.replace(/"/g, '')}</p>
                            </div>
                        </div>
                    </div>
                </div>
             </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
