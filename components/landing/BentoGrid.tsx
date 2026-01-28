'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Check, Loader2, FileText, Bell, Users, Calendar, ArrowRight, Building2, Wallet, AlertTriangle, UserPlus } from 'lucide-react';
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
      }, 1500);

      // Step 2: Date Extraction
      timeout = setTimeout(() => {
        setCurrentStep(2);
      }, 3000);

      // Step 3: Finish, show validating
      timeout = setTimeout(() => {
        setCurrentStep(3);
      }, 4500);

      // Step 4: Show Results
      timeout = setTimeout(() => {
        setCurrentStep(4);
      }, 6000);

      // Reset
      timeout = setTimeout(() => {
        runAnimation();
      }, 10000);
    };

    runAnimation();

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div id="bento-grid" className="py-12 sm:py-24 relative bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{t.bento.title}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t.bento.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(300px,auto)]">
          {/* Card 1: Ingestion Wizard - Large span */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-2 bg-white border border-gray-200 rounded-2xl p-8 overflow-hidden relative group hover:border-blue-300 transition-colors shadow-sm hover:shadow-md"
          >
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-50 rounded-lg border border-blue-100">
                        <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">{t.bento.ingestion.title}</h3>
                </div>
                <p className="text-gray-600 mb-8 max-w-md">
                    {t.bento.ingestion.description}
                </p>

                {/* Mock UI */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 max-w-lg mx-auto transform group-hover:scale-[1.02] transition-transform duration-500 min-h-[220px] flex flex-col justify-center">
                    <AnimatePresence mode="wait">
                        {currentStep < 4 ? (
                            <motion.div 
                                key="processing"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-4 w-full"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-900">Contract Analysis</span>
                                    <span className={`text-xs px-2 py-1 rounded-full transition-colors duration-300 ${
                                        currentStep === 3 ? 'text-green-600 bg-green-50' : 'text-blue-600 bg-blue-50'
                                    }`}>
                                        {currentStep === 3 ? 'Complete' : t.bento.ingestion.processing}
                                    </span>
                                </div>
                                <div className="space-y-3">
                                    {['Structure Analysis', 'Partner Identification', 'Date Extraction'].map((step, i) => {
                                        let status: 'waiting' | 'loading' | 'done' = 'waiting';
                                        if (i < currentStep) status = 'done';
                                        else if (i === currentStep) status = 'loading';

                                        return (
                                            <div key={i} className="flex items-center gap-3">
                                                <div className={`
                                                    w-6 h-6 rounded-full flex items-center justify-center border transition-all duration-300
                                                    ${status === 'done' ? 'bg-green-50 text-green-600 border-green-100' : 
                                                    status === 'loading' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-gray-50 text-gray-300 border-gray-100'}
                                                `}>
                                                    {status === 'done' ? (
                                                        <Check className="w-3.5 h-3.5" />
                                                    ) : status === 'loading' ? (
                                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                    ) : (
                                                        <div className="w-1.5 h-1.5 rounded-full bg-current" />
                                                    )}
                                                </div>
                                                <div className="h-2 bg-gray-100 rounded w-full overflow-hidden">
                                                    <motion.div 
                                                        className="h-full bg-blue-500 rounded"
                                                        initial={{ width: "0%" }}
                                                        animate={{ 
                                                            width: status === 'done' ? "100%" : status === 'loading' ? "60%" : "0%",
                                                            backgroundColor: status === 'done' ? "#22c55e" : "#3b82f6"
                                                        }}
                                                        transition={{ duration: 0.5 }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                     <div className={`flex items-center gap-3 transition-opacity duration-300 ${currentStep === 3 ? 'opacity-100' : 'opacity-50'}`}>
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                                            currentStep === 3 ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-gray-50 text-gray-300 border-gray-100'
                                        }`}>
                                            <Loader2 className={`w-3.5 h-3.5 ${currentStep === 3 ? 'animate-spin' : ''}`} />
                                        </div>
                                        <div className="text-sm text-gray-600 font-medium">{t.bento.ingestion.validating}</div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="results"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="space-y-4 w-full"
                            >
                                <div className="flex items-center gap-2 mb-2 text-green-600 bg-green-50 px-3 py-1.5 rounded-lg w-fit">
                                    <Check className="w-4 h-4" />
                                    <span className="text-xs font-semibold uppercase tracking-wide">{t.bento.ingestion.results.title}</span>
                                </div>
                                
                                <div className="space-y-3">
                                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                                        <div className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">{t.bento.ingestion.results.summaryLabel}</div>
                                        <p className="text-sm text-gray-900 leading-relaxed">
                                            {t.bento.ingestion.results.summaryText}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Building2 className="w-3.5 h-3.5 text-gray-400" />
                                                <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">{t.bento.ingestion.results.vendorLabel}</div>
                                            </div>
                                            <div className="text-sm font-semibold text-gray-900 truncate">{t.bento.ingestion.results.vendor}</div>
                                        </div>
                                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Wallet className="w-3.5 h-3.5 text-gray-400" />
                                                <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">{t.bento.ingestion.results.valueLabel}</div>
                                            </div>
                                            <div className="text-sm font-semibold text-gray-900">{t.bento.ingestion.results.value}</div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
          </motion.div>

          {/* Card 2: Proactive Guard - Alert */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="md:col-span-1 bg-white border border-gray-200 rounded-2xl p-8 relative overflow-hidden group hover:border-red-200 transition-colors shadow-sm hover:shadow-md"
          >
             <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-red-50 rounded-lg border border-red-100">
                        <Bell className="w-6 h-6 text-red-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">{t.bento.guard.title}</h3>
                </div>
                <p className="text-gray-600 mb-8">
                    {t.bento.guard.description}
                </p>

                {/* Mock Notification */}
                <div className="space-y-3">
                    <div className="bg-white rounded-lg p-3 shadow-md border border-gray-100 border-l-4 border-l-red-500 transform translate-x-2 group-hover:translate-x-0 transition-transform">
                        <div className="flex items-start gap-3">
                            <div className="mt-0.5">
                                <Calendar className="w-4 h-4 text-red-500" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-900">{t.bento.guard.alert1}</p>
                                <p className="text-xs text-gray-500">{t.bento.guard.alert1Sub}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white/80 rounded-lg p-3 shadow-sm border border-gray-100 border-l-4 border-l-blue-500 transform translate-x-6 group-hover:translate-x-4 transition-transform opacity-75">
                         <div className="flex items-start gap-3">
                            <div className="mt-0.5">
                                <Users className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-900">{t.bento.guard.alert2}</p>
                                <p className="text-xs text-gray-500">{t.bento.guard.alert2Sub}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white/60 rounded-lg p-3 shadow-sm border border-gray-100 border-l-4 border-l-amber-500 transform translate-x-8 group-hover:translate-x-6 transition-transform opacity-60">
                         <div className="flex items-start gap-3">
                            <div className="mt-0.5">
                                <AlertTriangle className="w-4 h-4 text-amber-500" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-900">{t.bento.guard.alert3}</p>
                                <p className="text-xs text-gray-500">{t.bento.guard.alert3Sub}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white/40 rounded-lg p-3 shadow-sm border border-gray-100 border-l-4 border-l-green-500 transform translate-x-10 group-hover:translate-x-8 transition-transform opacity-40">
                         <div className="flex items-start gap-3">
                            <div className="mt-0.5">
                                <UserPlus className="w-4 h-4 text-green-500" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-900">{t.bento.guard.alert4}</p>
                                <p className="text-xs text-gray-500">{t.bento.guard.alert4Sub}</p>
                            </div>
                        </div>
                    </div>
                </div>
             </div>
          </motion.div>

          {/* Card 3: Partner & Task Management */}
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="md:col-span-3 bg-white border border-gray-200 rounded-2xl p-8 overflow-hidden relative group hover:border-indigo-200 transition-colors shadow-sm hover:shadow-md"
          >
             <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
                <div>
                     <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-indigo-50 rounded-lg border border-indigo-100">
                            <Users className="w-6 h-6 text-indigo-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">{t.bento.collab.title}</h3>
                    </div>
                    <p className="text-gray-600 mb-6">
                        {t.bento.collab.description}
                    </p>
                    
                    <ul className="space-y-3 text-gray-600">
                        {t.bento.collab.list.map((item, i) => (
                            <li key={i} className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-indigo-500" />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Visuals Side */}
                <div className="relative h-full min-h-[300px] flex items-center justify-center p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg">
                        {/* Partner Card 1: Google */}
                        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold">G</div>
                                <div>
                                    <div className="text-sm font-bold text-gray-900">Google LLC</div>
                                    <div className="text-xs text-gray-500">{t.bento.collab.partnerCard}</div>
                                </div>
                            </div>
                            <div className="flex gap-2 text-xs flex-wrap">
                                 <div className="bg-green-50 text-green-700 px-2 py-1 rounded">3 Active</div>
                                 <div className="bg-red-50 text-red-700 px-2 py-1 rounded">1 Expiring</div>
                            </div>
                        </div>

                        {/* Partner Card 2: Salesforce */}
                        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-8 h-8 bg-[#00A1E0] rounded flex items-center justify-center text-white font-bold">S</div>
                                <div>
                                    <div className="text-sm font-bold text-gray-900">Salesforce</div>
                                    <div className="text-xs text-gray-500">{t.bento.collab.partnerCard}</div>
                                </div>
                            </div>
                            <div className="flex gap-2 text-xs flex-wrap">
                                 <div className="bg-green-50 text-green-700 px-2 py-1 rounded">1 Active</div>
                                 <div className="bg-blue-50 text-blue-700 px-2 py-1 rounded">Renewal</div>
                            </div>
                        </div>

                        {/* Task Card 1: Sarah */}
                        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                             <div className="flex items-center gap-2 mb-2">
                                <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold">S</div>
                                <span className="text-xs text-gray-500 truncate">{t.bento.collab.taskCard.assigned}</span>
                             </div>
                             <p className="text-sm font-medium text-gray-900 line-clamp-2">{t.bento.collab.taskCard.task}</p>
                             <div className="mt-2 text-xs text-gray-400">{t.bento.collab.taskCard.due}</div>
                        </div>

                        {/* Task Card 2: Mike */}
                        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                             <div className="flex items-center gap-2 mb-2">
                                <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold">M</div>
                                <span className="text-xs text-gray-500 truncate">{t.bento.collab.taskCard2.assigned}</span>
                             </div>
                             <p className="text-sm font-medium text-gray-900 line-clamp-2">{t.bento.collab.taskCard2.task}</p>
                             <div className="mt-2 text-xs text-red-500 font-medium">{t.bento.collab.taskCard2.due}</div>
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
