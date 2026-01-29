'use client';

import { motion, AnimatePresence, useMotionValue, useMotionTemplate, useSpring } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { Check, Loader2, FileText, Bell, Users, Calendar, Building2, Wallet, AlertTriangle, UserPlus, Zap, Shield, Search } from 'lucide-react';
import { useLanguage } from './LanguageContext';

export function BentoGrid() {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const shieldRef = useRef<HTMLDivElement>(null);
  const alertRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const shieldX = useMotionValue(0);
  const shieldY = useMotionValue(0);
  const alertX = useMotionValue(0);
  const alertY = useMotionValue(0);

  const springConfig = { stiffness: 100, damping: 30 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);
  const springShieldX = useSpring(shieldX, springConfig);
  const springShieldY = useSpring(shieldY, springConfig);
  const springAlertX = useSpring(alertX, springConfig);
  const springAlertY = useSpring(alertY, springConfig);

  const backgroundStyle = useMotionTemplate`
    radial-gradient(
      250px circle at ${springX}px ${springY}px,
      rgba(59, 130, 246, 0.4),
      transparent 80%
    )
  `;
  
  const shieldMaskStyle = useMotionTemplate`
    radial-gradient(
      120px circle at ${springShieldX}px ${springShieldY}px,
      black,
      transparent
    )
  `;

  const alertMaskStyle = useMotionTemplate`
    radial-gradient(
      180px circle at ${springAlertX}px ${springAlertY}px,
      black,
      transparent
    )
  `;

  function handleMouseMove({ clientX, clientY }: React.MouseEvent) {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    
    mouseX.set(clientX - containerRect.left);
    mouseY.set(clientY - containerRect.top);

    if (shieldRef.current) {
      const rect = shieldRef.current.getBoundingClientRect();
      shieldX.set(clientX - rect.left);
      shieldY.set(clientY - rect.top);
    }

    if (alertRef.current) {
        const rect = alertRef.current.getBoundingClientRect();
        alertX.set(clientX - rect.left);
        alertY.set(clientY - rect.top);
    }
  }

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
    <div id="bento-grid" className="py-20 sm:py-32 relative bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-left mb-16 sm:mb-24 max-w-3xl">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight mb-6">{t.bento.title}</h2>
          <p className="text-xl text-gray-500 leading-relaxed">
            {t.bento.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 sm:gap-8 auto-rows-[minmax(350px,auto)]">
          {/* Card 1: Ingestion Wizard - Large span */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-4 bg-gray-50 rounded-[2rem] p-8 sm:p-10 overflow-hidden relative group transition-all hover:bg-gray-100/80"
          >
            <div className="relative z-10 flex flex-col h-full">
                <div className="mb-8">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6">
                        <Zap className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{t.bento.ingestion.title}</h3>
                    <p className="text-gray-600 max-w-md text-lg">
                        {t.bento.ingestion.description}
                    </p>
                </div>

                {/* Mock UI */}
                <div className="mt-auto bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6 max-w-lg w-full mx-auto transform group-hover:scale-[1.02] transition-transform duration-500 h-[280px] flex flex-col justify-center">
                    <AnimatePresence mode="wait">
                        {currentStep < 4 ? (
                            <motion.div 
                                key="processing"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-5"
                            >
                                <div className="flex items-center justify-between border-b border-gray-50 pb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                                            <FileText className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-semibold text-gray-900">Contract_v2.pdf</div>
                                            <div className="text-xs text-gray-500">2.4 MB • Just now</div>
                                        </div>
                                    </div>
                                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                                        currentStep === 3 ? 'text-green-700 bg-green-50' : 'text-blue-700 bg-blue-50'
                                    }`}>
                                        {currentStep === 3 ? 'Complete' : t.bento.ingestion.processing}
                                    </span>
                                </div>
                                <div className="space-y-3">
                                    {['Analysis', 'Partner ID', 'Extraction'].map((step, i) => {
                                        let status: 'waiting' | 'loading' | 'done' = 'waiting';
                                        if (i < currentStep) status = 'done';
                                        else if (i === currentStep) status = 'loading';

                                        return (
                                            <div key={i} className="flex items-center justify-between group/step">
                                                <span className={`text-sm font-medium transition-colors ${status === 'waiting' ? 'text-gray-400' : 'text-gray-700'}`}>{step}</span>
                                                <div className="flex items-center gap-3">
                                                    {status === 'loading' && (
                                                        <span className="text-xs text-blue-600 font-medium animate-pulse">Processing...</span>
                                                    )}
                                                    <div className={`
                                                        w-5 h-5 rounded-full flex items-center justify-center border transition-all duration-300
                                                        ${status === 'done' ? 'bg-green-500 text-white border-green-500' : 
                                                        status === 'loading' ? 'border-blue-500 border-2' : 'border-gray-200'}
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
                                <div className="flex items-center gap-2 mb-4 text-green-700 bg-green-50 px-3 py-1.5 rounded-full w-fit">
                                    <Check className="w-4 h-4" />
                                    <span className="text-xs font-bold uppercase tracking-wide">{t.bento.ingestion.results.title}</span>
                                </div>
                                
                                <div className="p-4 bg-gray-50 rounded-xl">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Building2 className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm font-semibold text-gray-900">{t.bento.ingestion.results.vendor}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Wallet className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm font-medium text-gray-600">{t.bento.ingestion.results.value}</span>
                                    </div>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-xl">
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        {t.bento.ingestion.results.summaryText}
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
          </motion.div>

          {/* Card 2: Proactive Guard - Alert */}
          <motion.div 
            ref={containerRef}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="md:col-span-2 bg-gray-900 text-white rounded-[2rem] p-8 sm:p-10 relative overflow-hidden group"
            onMouseMove={handleMouseMove}
          >
             {/* Decorative gradient */}
             <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-20 group-hover:opacity-0 transition-opacity duration-500"></div>
             
             <motion.div
               className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-40 transition-opacity duration-500"
               style={{
                 background: backgroundStyle
               }}
             />
             
             <div className="relative z-10 flex flex-col h-full">
                <div className="mb-8">
                    <div ref={shieldRef} className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm mb-6 relative group/shield overflow-hidden">
                        <Shield className="w-6 h-6 text-white/40" />
                        <motion.div 
                          className="absolute inset-0 flex items-center justify-center text-white"
                          style={{
                            maskImage: shieldMaskStyle,
                            WebkitMaskImage: shieldMaskStyle
                          }}
                        >
                          <Shield className="w-6 h-6 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                        </motion.div>
                        {/* Border Shine */}
                        <motion.div
                           className="absolute inset-0 rounded-2xl border border-white/50 opacity-0 group-hover:opacity-100"
                           style={{
                             maskImage: shieldMaskStyle,
                             WebkitMaskImage: shieldMaskStyle
                           }}
                        />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">{t.bento.guard.title}</h3>
                    <p className="text-gray-400 text-lg leading-relaxed">
                        {t.bento.guard.description}
                    </p>
                </div>

                <div ref={alertRef} className="mt-auto space-y-3 relative">
                    {/* Alert 1 */}
                    <div className="relative group/alert">
                        {/* Base Layer */}
                        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/5 flex items-center gap-4 transition-colors">
                            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                                <Bell className="w-5 h-5 text-red-400" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-white">{t.bento.guard.alert1}</p>
                                <p className="text-xs text-gray-400">{t.bento.guard.alert1Sub}</p>
                            </div>
                        </div>

                        {/* Highlight Layer */}
                        <motion.div 
                            className="absolute inset-0 bg-white/20 backdrop-blur-md rounded-xl p-4 border border-white/40 flex items-center gap-4 z-10 pointer-events-none"
                            style={{
                                maskImage: alertMaskStyle,
                                WebkitMaskImage: alertMaskStyle
                            }}
                        >
                            <div className="w-10 h-10 rounded-full bg-red-500/30 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(239,68,68,0.5)]">
                                <Bell className="w-5 h-5 text-red-200 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">{t.bento.guard.alert1}</p>
                                <p className="text-xs text-gray-200">{t.bento.guard.alert1Sub}</p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Alert 2 */}
                    <div className="relative group/alert">
                         {/* Base Layer */}
                        <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/5 flex items-center gap-4 opacity-60">
                             <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
                                <AlertTriangle className="w-5 h-5 text-amber-400" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-white">{t.bento.guard.alert3}</p>
                                <p className="text-xs text-gray-400">{t.bento.guard.alert3Sub}</p>
                            </div>
                        </div>

                         {/* Highlight Layer */}
                         <motion.div 
                            className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/30 flex items-center gap-4 opacity-100 z-10 pointer-events-none"
                            style={{
                                maskImage: alertMaskStyle,
                                WebkitMaskImage: alertMaskStyle
                            }}
                        >
                             <div className="w-10 h-10 rounded-full bg-amber-500/30 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(245,158,11,0.5)]">
                                <AlertTriangle className="w-5 h-5 text-amber-200 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">{t.bento.guard.alert3}</p>
                                <p className="text-xs text-gray-200">{t.bento.guard.alert3Sub}</p>
                            </div>
                        </motion.div>
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
            className="md:col-span-6 bg-gray-50 rounded-[2rem] p-8 sm:p-12 overflow-hidden relative group"
          >
             <div className="grid md:grid-cols-2 gap-16 items-center relative z-10">
                <div>
                     <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6">
                        <Users className="w-6 h-6 text-indigo-600" />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-4">{t.bento.collab.title}</h3>
                    <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                        {t.bento.collab.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-3">
                        {t.bento.collab.list.map((item, i) => (
                            <span key={i} className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full text-sm font-medium text-gray-700 shadow-sm border border-gray-100">
                                <Check className="w-4 h-4 text-green-500" />
                                {item}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Visuals Side */}
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-transparent z-10 w-10 md:hidden"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                        <div className="space-y-4">
                             {/* Partner Card 1 */}
                            <div className="bg-white rounded-2xl p-5 shadow-xl shadow-gray-200/50 border border-gray-100">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">G</div>
                                    <div>
                                        <div className="text-sm font-bold text-gray-900">Google LLC</div>
                                        <div className="text-xs text-gray-500">Service Provider</div>
                                    </div>
                                </div>
                                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-green-500 w-3/4 rounded-full"></div>
                                </div>
                            </div>
                            
                             {/* Task Card 1 */}
                             <div className="bg-white rounded-2xl p-5 shadow-xl shadow-gray-200/50 border border-gray-100 opacity-80">
                                <div className="flex items-center justify-between mb-2">
                                   <div className="flex -space-x-2">
                                       <div className="w-6 h-6 rounded-full bg-purple-100 border-2 border-white"></div>
                                       <div className="w-6 h-6 rounded-full bg-yellow-100 border-2 border-white"></div>
                                   </div>
                                   <span className="text-xs font-semibold text-red-500">{t.bento.collab.taskCard.due}</span>
                                </div>
                                <p className="text-sm font-medium text-gray-900">{t.bento.collab.taskCard.task.replace(/"/g, '')}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {/* Partner Card 2 */}
                            <div className="bg-white rounded-2xl p-5 shadow-xl shadow-gray-200/50 border border-gray-100">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-black/20">S</div>
                                    <div>
                                        <div className="text-sm font-bold text-gray-900">Salesforce</div>
                                        <div className="text-xs text-gray-500">CRM Platform</div>
                                    </div>
                                </div>
                                <div className="flex gap-2 text-xs">
                                     <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md font-medium">Auto-Renew</span>
                                </div>
                            </div>

                            {/* Task Card 2 */}
                             <div className="bg-white rounded-2xl p-5 shadow-xl shadow-gray-200/50 border border-gray-100 opacity-80">
                                <div className="flex items-center justify-between mb-2">
                                   <div className="flex -space-x-2">
                                       <div className="w-6 h-6 rounded-full bg-green-100 border-2 border-white"></div>
                                       <div className="w-6 h-6 rounded-full bg-blue-100 border-2 border-white"></div>
                                   </div>
                                   <span className="text-xs font-semibold text-orange-500">{t.bento.collab.taskCard2.due}</span>
                                </div>
                                <p className="text-sm font-medium text-gray-900">{t.bento.collab.taskCard2.task.replace(/"/g, '')}</p>
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
