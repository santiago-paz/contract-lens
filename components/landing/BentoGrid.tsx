'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Check, Loader2, FileText, Bell, Users, Zap, Shield, AlertTriangle, ArrowRight } from 'lucide-react';
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
    <div id="bento-grid" className="py-24 sm:py-32 relative bg-white border-b-2 border-black overflow-hidden bg-noise">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-100 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-left mb-20 sm:mb-28 max-w-4xl">
          <h2 className="text-5xl sm:text-7xl font-black text-black tracking-tighter mb-8 uppercase leading-[0.9]">
            {t.bento.title}
          </h2>
          <p className="text-2xl font-mono text-black leading-relaxed border-l-4 border-[#CCFF00] pl-8 bg-white/80 inline-block pr-8 py-4 backdrop-blur-sm shadow-hard-sm border-y-2 border-r-2 border-black">
            {t.bento.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-8 auto-rows-[minmax(400px,auto)]">
          {/* Card 1: Ingestion Wizard - Large span */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-4 bg-white border-2 border-black shadow-hard p-8 sm:p-12 relative group hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <Zap size={120} />
            </div>
            
            <div className="relative z-10 flex flex-col h-full">
                <div className="mb-10">
                    <div className="w-14 h-14 bg-[#CCFF00] border-2 border-black flex items-center justify-center mb-6 shadow-hard-sm">
                        <Zap className="w-8 h-8 text-black" />
                    </div>
                    <h3 className="text-3xl font-black font-mono text-black mb-4 uppercase tracking-tight">{t.bento.ingestion.title}</h3>
                    <p className="text-black/70 font-mono text-sm max-w-md leading-relaxed border-l-2 border-black pl-4">
                        {t.bento.ingestion.description}
                    </p>
                </div>

                {/* Mock UI */}
                <div className="mt-auto bg-white border-2 border-black shadow-hard-sm p-6 max-w-xl w-full mx-auto h-[300px] flex flex-col justify-center relative hover:scale-[1.02] transition-transform duration-500">
                    {/* Header bar */}
                    <div className="absolute top-0 left-0 right-0 h-10 bg-black flex items-center px-4 justify-between">
                         <span className="text-white font-mono text-[10px] uppercase tracking-widest flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#CCFF00] animate-pulse"></span>
                            DATA_INGESTION_STREAM
                         </span>
                         <div className="flex gap-1.5">
                             <div className="w-3 h-3 bg-[#CCFF00] border border-white/20"></div>
                             <div className="w-3 h-3 bg-white border border-white/20"></div>
                         </div>
                    </div>
                    
                    <div className="mt-8">
                    <AnimatePresence mode="wait">
                        {currentStep < 4 ? (
                            <motion.div 
                                key="processing"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-6"
                            >
                                <div className="flex items-center justify-between border-b-2 border-gray-100 pb-5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-gray-50 border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000]">
                                            <FileText className="w-5 h-5 text-black" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold font-mono text-black uppercase">MASTER_SERVICE_AGREEMENT_V1.PDF</div>
                                            <div className="text-[10px] font-mono text-gray-500 uppercase">Size: 2.4 MB // Type: PDF</div>
                                        </div>
                                    </div>
                                    <span className={`text-[10px] font-bold font-mono px-3 py-1 border-2 border-black uppercase ${
                                        currentStep === 3 ? 'bg-[#CCFF00] text-black shadow-[2px_2px_0px_0px_#000]' : 'bg-white text-black'
                                    }`}>
                                        {currentStep === 3 ? 'VERIFIED' : 'ANALYZING...'}
                                    </span>
                                </div>
                                <div className="space-y-4">
                                    {['Analysis', 'Partner ID', 'Extraction'].map((step, i) => {
                                        let status: 'waiting' | 'loading' | 'done' = 'waiting';
                                        if (i < currentStep) status = 'done';
                                        else if (i === currentStep) status = 'loading';

                                        return (
                                            <div key={i} className="flex items-center justify-between group/step">
                                                <span className={`text-sm font-mono font-bold uppercase transition-colors ${status === 'waiting' ? 'text-gray-300' : 'text-black'}`}>{step}</span>
                                                <div className="flex items-center gap-3">
                                                    {status === 'loading' && (
                                                        <span className="text-[10px] text-black font-mono animate-pulse uppercase">Processing chunk {i + 1}/3</span>
                                                    )}
                                                    <div className={`
                                                        w-5 h-5 flex items-center justify-center border-2 border-black transition-all duration-0
                                                        ${status === 'done' ? 'bg-black text-[#CCFF00]' : 
                                                        status === 'loading' ? 'bg-[#CCFF00] shadow-[2px_2px_0px_0px_#000]' : 'bg-white'}
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
                                className="space-y-5"
                            >
                                <div className="flex items-center gap-3 mb-4 bg-[#CCFF00] px-4 py-2 border-2 border-black w-fit shadow-hard-sm transform -rotate-1">
                                    <Check className="w-5 h-5 text-black" />
                                    <span className="text-xs font-black font-mono uppercase tracking-wide text-black">{t.bento.ingestion.results.title}</span>
                                </div>
                                
                                <div className="p-5 bg-gray-50 border-2 border-black relative">
                                    <div className="absolute top-2 right-2 text-[8px] font-mono text-gray-400 uppercase">JSON_OUTPUT</div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-sm font-bold font-mono text-black uppercase bg-black text-white px-1">{t.bento.ingestion.results.vendor}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg font-mono font-bold text-black border-b-2 border-[#CCFF00]">{t.bento.ingestion.results.value}</span>
                                    </div>
                                </div>
                                <div className="p-5 bg-white border-2 border-black border-dashed">
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
            className="md:col-span-2 bg-black text-white p-8 sm:p-12 relative overflow-hidden group border-2 border-black shadow-hard hover:shadow-[8px_8px_0px_0px_#CCFF00] transition-all duration-300"
          >
             <div className="absolute top-0 right-0 w-32 h-32 bg-[#CCFF00] opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
             
             <div className="relative z-10 flex flex-col h-full">
                <div className="mb-10">
                    <div className="w-14 h-14 bg-white/10 border border-white/20 flex items-center justify-center mb-6 backdrop-blur-md">
                        <Shield className="w-8 h-8 text-[#CCFF00]" />
                    </div>
                    <h3 className="text-3xl font-black font-mono text-white mb-4 uppercase tracking-tight">{t.bento.guard.title}</h3>
                    <p className="text-gray-400 font-mono text-xs leading-relaxed uppercase border-l-2 border-[#CCFF00] pl-4">
                        {t.bento.guard.description}
                    </p>
                </div>

                <div className="mt-auto space-y-4 relative">
                    {/* Alert 1 */}
                    <div className="relative group/alert">
                        <div className="bg-white/5 border border-white/20 p-5 flex items-center gap-4 transition-all hover:bg-white/10 hover:translate-x-1 hover:border-[#CCFF00]/50">
                            <div className="w-10 h-10 bg-red-500/20 flex items-center justify-center shrink-0 border border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]">
                                <Bell className="w-5 h-5 text-red-500 fill-red-500" />
                            </div>
                            <div>
                                <p className="text-sm font-bold font-mono text-white uppercase tracking-wide">{t.bento.guard.alert1}</p>
                                <p className="text-[10px] font-mono text-gray-500 uppercase mt-1">{t.bento.guard.alert1Sub}</p>
                            </div>
                        </div>
                    </div>

                    {/* Alert 2 */}
                    <div className="relative group/alert">
                        <div className="bg-white/5 border border-white/20 p-5 flex items-center gap-4 transition-all hover:bg-white/10 hover:translate-x-1 hover:border-blue-500/50">
                            <div className="w-10 h-10 bg-blue-500/20 flex items-center justify-center shrink-0 border border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]">
                                <FileText className="w-5 h-5 text-blue-500 fill-blue-500" />
                            </div>
                            <div>
                                <p className="text-sm font-bold font-mono text-white uppercase tracking-wide">{t.bento.guard.alert2}</p>
                                <p className="text-[10px] font-mono text-gray-500 uppercase mt-1">{t.bento.guard.alert2Sub}</p>
                            </div>
                        </div>
                    </div>

                    {/* Alert 3 */}
                    <div className="relative group/alert">
                        <div className="bg-white/5 border border-white/20 p-5 flex items-center gap-4 opacity-70 hover:opacity-100 transition-all hover:translate-x-1">
                             <div className="w-10 h-10 bg-amber-500/20 flex items-center justify-center shrink-0 border border-amber-500">
                                <AlertTriangle className="w-5 h-5 text-amber-500 fill-amber-500" />
                            </div>
                            <div>
                                <p className="text-sm font-bold font-mono text-white uppercase tracking-wide">{t.bento.guard.alert3}</p>
                                <p className="text-[10px] font-mono text-gray-500 uppercase mt-1">{t.bento.guard.alert3Sub}</p>
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
            className="md:col-span-6 bg-white border-2 border-black shadow-hard p-8 sm:p-16 overflow-hidden relative hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-300"
          >
             <div className="grid md:grid-cols-2 gap-20 items-center relative z-10">
                <div>
                     <div className="w-14 h-14 bg-black flex items-center justify-center mb-8 shadow-[4px_4px_0px_0px_#CCFF00]">
                        <Users className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-4xl font-black font-mono text-black mb-6 uppercase tracking-tighter">{t.bento.collab.title}</h3>
                    <p className="text-xl font-mono text-black/70 mb-10 leading-relaxed max-w-lg">
                        {t.bento.collab.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-4">
                        {t.bento.collab.list.map((item, i) => (
                            <span key={i} className="inline-flex items-center gap-3 bg-[#CCFF00] px-5 py-3 border-2 border-black text-sm font-bold font-mono text-black uppercase shadow-hard-sm hover:-translate-y-1 transition-transform cursor-default">
                                <Check className="w-4 h-4 text-black stroke-[3]" />
                                {item}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Visuals Side */}
                <div className="relative">
                    <div className="absolute -inset-4 bg-gray-100 border-2 border-black transform rotate-2 -z-10 opacity-50"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                        <div className="space-y-6 pt-8">
                             {/* Partner Card 1 */}
                            <div className="bg-white p-6 border-2 border-black shadow-hard hover:shadow-[6px_6px_0px_0px_#000] hover:-translate-y-1 transition-all">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-10 h-10 bg-blue-600 border-2 border-black flex items-center justify-center text-white font-bold font-mono text-xl shadow-sm">G</div>
                                    <div>
                                        <div className="text-sm font-black font-mono text-black uppercase">Google LLC</div>
                                        <div className="text-[10px] font-mono text-gray-500 uppercase bg-gray-100 px-1 inline-block mt-1">Service Provider</div>
                                    </div>
                                </div>
                                <div className="h-3 w-full bg-gray-100 border-2 border-black relative overflow-hidden">
                                    <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
                                    <div className="h-full bg-[#CCFF00] w-3/4 border-r-2 border-black"></div>
                                </div>
                            </div>
                            
                             {/* Task Card 1 */}
                             <div className="bg-gray-50 p-6 border-2 border-black opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
                                <div className="flex items-center justify-between mb-3">
                                   <div className="flex -space-x-2">
                                       <div className="w-8 h-8 bg-black border-2 border-white rounded-full"></div>
                                       <div className="w-8 h-8 bg-gray-500 border-2 border-white rounded-full"></div>
                                   </div>
                                   <span className="text-[10px] font-black font-mono text-red-600 uppercase border border-red-600 px-2 py-0.5 bg-red-50">{t.bento.collab.taskCard.due}</span>
                                </div>
                                <p className="text-sm font-bold font-mono text-black uppercase">{t.bento.collab.taskCard.task.replace(/"/g, '')}</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {/* Partner Card 2 */}
                            <div className="bg-white p-6 border-2 border-black shadow-hard hover:shadow-[6px_6px_0px_0px_#000] hover:-translate-y-1 transition-all">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-10 h-10 bg-black border-2 border-black flex items-center justify-center text-white font-bold font-mono text-xl shadow-sm">S</div>
                                    <div>
                                        <div className="text-sm font-black font-mono text-black uppercase">Salesforce</div>
                                        <div className="text-[10px] font-mono text-gray-500 uppercase bg-gray-100 px-1 inline-block mt-1">CRM Platform</div>
                                    </div>
                                </div>
                                <div className="flex gap-2 text-xs">
                                     <span className="bg-[#CCFF00]/20 border border-[#CCFF00] text-black px-2 py-1 font-bold font-mono uppercase flex items-center gap-1">
                                        <Zap className="w-3 h-3" />
                                        Auto-Renew
                                     </span>
                                </div>
                            </div>

                            {/* Task Card 2 */}
                             <div className="bg-gray-50 p-6 border-2 border-black opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
                                <div className="flex items-center justify-between mb-3">
                                   <div className="flex -space-x-2">
                                       <div className="w-8 h-8 bg-[#CCFF00] border-2 border-black rounded-full"></div>
                                       <div className="w-8 h-8 bg-white border-2 border-black rounded-full"></div>
                                   </div>
                                   <span className="text-[10px] font-black font-mono text-orange-600 uppercase border border-orange-600 px-2 py-0.5 bg-orange-50">{t.bento.collab.taskCard2.due}</span>
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
