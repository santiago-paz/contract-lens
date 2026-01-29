'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Zap, Check, Loader2, AlertCircle } from 'lucide-react';
import { useLanguage } from './LanguageContext';

export function ContractAnalysisVisual() {
  const { t } = useLanguage();
  const [animationState, setAnimationState] = useState<'chaos' | 'scanning' | 'extracting' | 'clarity'>('chaos');

  // Loop the animation
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const runSequence = () => {
      setAnimationState('chaos');
      
      // Start scanning after 1s
      timeout = setTimeout(() => setAnimationState('scanning'), 1000);
      
      // Start extracting after scanning (assume scan takes 2s)
      timeout = setTimeout(() => setAnimationState('extracting'), 3000);
      
      // Show clarity/result after extracting (assume extraction takes 1.5s)
      timeout = setTimeout(() => setAnimationState('clarity'), 4500);
      
      // Reset loop after holding clarity for 3s
      timeout = setTimeout(runSequence, 8000);
    };

    runSequence();
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="relative h-[600px] flex items-center justify-center w-full perspective-1000">
      <div className="relative w-full max-w-lg h-[500px]">
        
        {/* Layer 1: Chaos (The Document) */}
        <DocumentLayer state={animationState} />

        {/* Layer 2: Scanner (The Laser) */}
        <ScannerLayer state={animationState} />

        {/* Layer 3: Extraction (Flying Data) */}
        <ExtractionLayer state={animationState} t={t} />

        {/* Layer 4: Clarity (The Card) */}
        <ClarityLayer state={animationState} t={t} />

      </div>
    </div>
  );
}

function DocumentLayer({ state }: { state: string }) {
  // Dense text simulation
  const denseText = Array(40).fill("lorem ipsum dolor sit amet contract agreement legal binding terms conditions clauses liability indemnification termination renewal payment schedule services deliverables confidential proprietary information force majeure governing law jurisdiction arbitration notices amendments waiver severability assignment successors entire agreement counterparts executed witnesses date effective signature title representative authorized parties").join(" ");

  return (
    <motion.div
      initial={{ rotateY: -5, rotateX: 5, z: -50, opacity: 0.6 }}
      animate={{ 
        rotateY: state === 'clarity' ? -15 : -5,
        rotateX: state === 'clarity' ? 10 : 5,
        z: state === 'clarity' ? -100 : -50,
        opacity: state === 'clarity' ? 0.3 : 0.6,
        scale: state === 'clarity' ? 0.9 : 0.95
      }}
      transition={{ duration: 1 }}
      className="absolute inset-0 bg-white border border-gray-200 rounded-2xl shadow-sm p-8 overflow-hidden origin-center"
    >
      <div className="w-16 h-16 bg-gray-100 rounded-lg mb-6 flex items-center justify-center">
        <FileText className="w-8 h-8 text-gray-400" />
      </div>
      <div className="text-[6px] text-gray-300 leading-relaxed text-justify opacity-50 select-none">
        {denseText}
      </div>
      
      {/* Embedded Data Points (that will be scanned) */}
      <div className="absolute top-40 left-12 right-12 h-6 bg-yellow-100/0 data-point-1" />
      <div className="absolute top-64 left-12 w-32 h-6 bg-yellow-100/0 data-point-2" />
      <div className="absolute bottom-32 right-12 w-48 h-6 bg-yellow-100/0 data-point-3" />
    </motion.div>
  );
}

function ScannerLayer({ state }: { state: string }) {
  const isScanning = state === 'scanning' || state === 'extracting';
  
  return (
    <AnimatePresence>
      {isScanning && (
        <motion.div
          initial={{ top: '0%', opacity: 0 }}
          animate={{ top: '100%', opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2.5, ease: "linear" }}
          className="absolute left-0 right-0 h-2 bg-blue-500/50 blur-sm shadow-[0_0_20px_rgba(59,130,246,0.5)] z-10"
          style={{ width: '100%' }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400 to-transparent" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ExtractionLayer({ state, t }: { state: string, t: any }) {
  const isExtracting = state === 'extracting' || state === 'clarity';

  // These represent the extracted data points flying from document to card
  return (
    <div className="absolute inset-0 z-20 pointer-events-none">
       <AnimatePresence>
         {state === 'extracting' && (
           <>
             <FlyingDataPoint 
               text={t.hero.card.vendor} 
               start={{ top: '30%', left: '20%' }} 
               delay={0} 
             />
             <FlyingDataPoint 
               text={t.hero.card.value} 
               start={{ top: '50%', left: '20%' }} 
               delay={0.2} 
             />
             <FlyingDataPoint 
               text={t.hero.card.date} 
               start={{ top: '70%', left: '60%' }} 
               delay={0.4} 
             />
           </>
         )}
       </AnimatePresence>
    </div>
  );
}

function FlyingDataPoint({ text, start, delay }: { text: string, start: { top: string, left: string }, delay: number }) {
  return (
    <motion.div
      initial={{ ...start, scale: 0.8, opacity: 0 }}
      animate={{ 
        top: '50%', 
        left: '50%', 
        scale: 0.5, 
        opacity: 0 
      }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, delay, ease: "easeInOut" }}
      className="absolute bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold whitespace-nowrap border border-blue-200 shadow-sm"
    >
      {text}
    </motion.div>
  );
}

function ClarityLayer({ state, t }: { state: string, t: any }) {
  // Show card when extraction starts, but fill data when clarity is reached
  const isVisible = state !== 'chaos';
  const isFilled = state === 'clarity';

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ 
        opacity: isVisible ? 1 : 0, 
        y: isVisible ? 0 : 50,
        scale: isVisible ? 1 : 0.9
      }}
      transition={{ duration: 0.5 }}
      className="absolute inset-x-4 top-12 bottom-12 bg-white/90 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl p-6 ring-1 ring-gray-900/5 z-30 flex flex-col"
    >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                    <Zap className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="font-semibold text-gray-900">Contract Intelligence</h3>
                    <p className="text-xs text-gray-500">{isFilled ? t.hero.card.complete : "Processing..."}</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isFilled ? 'bg-green-500' : 'bg-yellow-400 animate-pulse'}`}></div>
                <span className="text-xs font-medium text-gray-500">{isFilled ? 'Active' : 'Analyzing'}</span>
            </div>
        </div>

        {/* Data Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
            <DataField label={t.hero.card.vendorLabel || "Vendor"} value={t.hero.card.vendor} isFilled={isFilled} delay={0.1} />
            <DataField label={t.hero.card.type || "Type"} value="Master Service Agreement" isFilled={isFilled} delay={0.2} />
            <DataField label={t.hero.card.valueLabel} value={t.hero.card.value} isFilled={isFilled} delay={0.3} />
            <DataField label={t.hero.card.dateLabel} value={t.hero.card.date} isFilled={isFilled} delay={0.4} />
        </div>

        {/* Risk Alert (appears last) */}
        <div className="mt-auto">
             <AnimatePresence>
                {isFilled && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ delay: 0.5 }}
                        className="bg-red-50 rounded-xl p-3 border border-red-100"
                    >
                        <div className="flex items-center gap-2 mb-1">
                            <AlertCircle className="w-4 h-4 text-red-600" />
                            <span className="text-xs font-bold text-red-700 uppercase">{t.hero.card.riskTitle}</span>
                        </div>
                        <p className="text-xs text-red-800">{t.hero.card.riskText}</p>
                    </motion.div>
                )}
             </AnimatePresence>
        </div>
    </motion.div>
  );
}

function DataField({ label, value, isFilled, delay }: { label: string, value: string, isFilled: boolean, delay: number }) {
    return (
        <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">{label}</p>
            {isFilled ? (
                <motion.p 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay }}
                    className="text-sm font-semibold text-gray-900 truncate"
                >
                    {value}
                </motion.p>
            ) : (
                <motion.div 
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: [0.5, 0.8, 0.5] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="h-5 bg-gray-100 rounded w-full" 
                />
            )}
        </div>
    );
}
