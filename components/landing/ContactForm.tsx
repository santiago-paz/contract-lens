'use client';

import { useState } from 'react';
import { Send, Loader2, CheckCircle2, FileText, PenTool, ArrowRight, Terminal } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

export function ContactForm() {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
        setLoading(false);
        setSuccess(true);
    }, 1500);
  };

  return (
    <div id="contact-form" className="py-24 sm:py-32 bg-white relative overflow-hidden border-t-2 border-black bg-noise">
        {/* Grid Background */}
        <div className="absolute inset-0 bg-grid-pattern opacity-100 pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white border-2 border-black shadow-[12px_12px_0px_0px_#000]"
            >
                {/* Document Header */}
                <div className="bg-black text-white p-6 sm:p-8 border-b-2 border-black flex justify-between items-start relative overflow-hidden">
                    <div className="absolute right-0 top-0 p-4 opacity-10">
                        <Terminal size={120} />
                    </div>
                    
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                             <div className="bg-[#CCFF00] text-black w-8 h-8 flex items-center justify-center border-2 border-white shadow-[2px_2px_0px_0px_rgba(255,255,255,0.5)]">
                                <span className="font-black font-mono text-sm leading-none">S</span>
                             </div>
                             <div className="flex flex-col">
                                <span className="font-bold font-mono text-sm tracking-widest text-white uppercase leading-none">Blackletter</span>
                                <span className="text-[10px] font-mono text-[#CCFF00] uppercase tracking-wider">{t.contact.secureChannel}</span>
                             </div>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-black font-mono text-white tracking-tighter uppercase mb-2">{t.contact.headerTitle}</h2>
                        <div className="inline-flex items-center gap-2 border border-white/30 px-2 py-1 bg-white/5 backdrop-blur-sm">
                            <span className="w-2 h-2 rounded-full bg-[#CCFF00] animate-pulse"></span>
                            <p className="text-[#CCFF00] text-xs font-mono uppercase tracking-widest">{t.contact.refCode}-{(new Date()).getFullYear()}-001</p>
                        </div>
                    </div>
                    
                    <div className="hidden sm:block relative z-10">
                        <div className="w-24 h-24 border-2 border-white flex items-center justify-center opacity-100 rotate-3 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] bg-black">
                            <span className="font-mono font-bold text-white text-[10px] uppercase text-center leading-tight tracking-wider">
                                {t.contact.officialInquiry.split(' ').map((word, i) => (
                                    <span key={i} className="block">{word}</span>
                                ))}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="p-8 sm:p-12 bg-white relative">
                    {/* Decorative margin line */}
                    <div className="absolute left-8 sm:left-12 top-0 bottom-0 w-px bg-red-500/20 pointer-events-none hidden sm:block"></div>
                    
                    <AnimatePresence mode="wait">
                        {success ? (
                            <motion.div 
                                key="success"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="text-center py-12 flex flex-col items-center justify-center h-full min-h-[400px] sm:pl-8"
                            >
                                <motion.div 
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", delay: 0.2 }}
                                    className="w-24 h-24 bg-[#CCFF00] flex items-center justify-center mb-8 border-2 border-black shadow-hard"
                                >
                                    <CheckCircle2 className="w-12 h-12 text-black" />
                                </motion.div>
                                <h3 className="text-3xl font-black font-mono text-black uppercase mb-4 tracking-tight">{t.contact.sentTitle}</h3>
                                <p className="text-black font-mono mb-10 max-w-sm text-sm uppercase leading-relaxed border-l-2 border-black pl-4">
                                    {t.contact.sentDesc}
                                </p>
                                
                                <button 
                                    onClick={() => setSuccess(false)}
                                    className="px-8 py-3 bg-black text-white text-sm font-bold font-mono uppercase hover:bg-[#CCFF00] hover:text-black border-2 border-black shadow-hard hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                                >
                                    {t.contact.sendAnother}
                                </button>
                            </motion.div>
                        ) : (
                            <motion.form 
                                key="form"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onSubmit={handleSubmit} 
                                className="space-y-12 sm:pl-8"
                            >
                                {/* Section 1 */}
                                <div className="space-y-8">
                                    <div className="flex items-center gap-4">
                                        <span className="bg-black text-white text-xs font-bold font-mono px-3 py-1 uppercase shadow-sm">{t.contact.section1}</span>
                                        <h3 className="text-sm font-bold font-mono text-black uppercase tracking-widest border-b-2 border-black pb-1 flex-grow">{t.contact.theParties}</h3>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8">
                                        <div className="relative group">
                                            <label htmlFor="name" className={`block text-xs font-bold font-mono uppercase tracking-wider mb-2 transition-colors ${focusedField === 'name' ? 'text-black' : 'text-gray-500'}`}>
                                                {t.contact.name}
                                            </label>
                                            <input 
                                                id="name"
                                                type="text" 
                                                required
                                                onFocus={() => setFocusedField('name')}
                                                onBlur={() => setFocusedField(null)}
                                                className="w-full bg-gray-50 border-2 border-black px-4 py-4 text-black text-sm font-mono focus:bg-[#CCFF00] focus:outline-none transition-all placeholder:text-gray-400 uppercase shadow-sm focus:shadow-hard-sm"
                                                placeholder={t.contact.enterFullName}
                                            />
                                        </div>
                                        <div className="relative group">
                                            <label htmlFor="email" className={`block text-xs font-bold font-mono uppercase tracking-wider mb-2 transition-colors ${focusedField === 'email' ? 'text-black' : 'text-gray-500'}`}>
                                                {t.contact.email}
                                            </label>
                                            <input 
                                                id="email"
                                                type="email" 
                                                required
                                                onFocus={() => setFocusedField('email')}
                                                onBlur={() => setFocusedField(null)}
                                                className="w-full bg-gray-50 border-2 border-black px-4 py-4 text-black text-sm font-mono focus:bg-[#CCFF00] focus:outline-none transition-all placeholder:text-gray-400 uppercase shadow-sm focus:shadow-hard-sm"
                                                placeholder={t.contact.enterEmail}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Section 2 */}
                                <div className="space-y-8">
                                    <div className="flex items-center gap-4">
                                        <span className="bg-black text-white text-xs font-bold font-mono px-3 py-1 uppercase shadow-sm">{t.contact.section2}</span>
                                        <h3 className="text-sm font-bold font-mono text-black uppercase tracking-widest border-b-2 border-black pb-1 flex-grow">{t.contact.theDetails}</h3>
                                    </div>

                                    <div className="relative">
                                        <label htmlFor="message" className={`block text-xs font-bold font-mono uppercase tracking-wider mb-2 transition-colors ${focusedField === 'message' ? 'text-black' : 'text-gray-500'}`}>
                                            {t.contact.message}
                                        </label>
                                        <textarea 
                                            id="message"
                                            required
                                            rows={5}
                                            onFocus={() => setFocusedField('message')}
                                            onBlur={() => setFocusedField(null)}
                                            className="w-full bg-gray-50 border-2 border-black px-4 py-4 text-black text-sm font-mono focus:bg-[#CCFF00] focus:outline-none transition-all resize-none placeholder:text-gray-400 leading-relaxed uppercase shadow-sm focus:shadow-hard-sm"
                                            placeholder={t.contact.describeInquiry}
                                        />
                                    </div>
                                </div>

                                {/* Footer / Sign */}
                                <div className="pt-8 border-t-2 border-black mt-8 bg-gray-50 -mx-8 sm:-mx-12 px-8 sm:px-12 pb-2">
                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
                                        <div className="text-[10px] font-mono text-gray-500 max-w-xs uppercase text-center sm:text-left leading-relaxed flex items-center gap-2">
                                            <span className="text-xl">⚠️</span>
                                            {t.contact.disclaimer}
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full sm:w-auto group relative inline-flex items-center justify-center px-10 py-4 bg-black text-white text-sm font-bold font-mono uppercase border-2 border-black shadow-hard hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none hover:bg-[#CCFF00] hover:text-black transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                                        >
                                            {loading ? (
                                                <span className="flex items-center gap-2">
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    {t.contact.submitting}
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-2">
                                                    {t.contact.submitButton}
                                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                                </span>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    </div>
  );
}
