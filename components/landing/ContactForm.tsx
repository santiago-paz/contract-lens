'use client';

import { useState } from 'react';
import { Send, Loader2, CheckCircle2, FileText, PenTool, ArrowRight } from 'lucide-react';
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
    <div id="contact-form" className="py-24 bg-white relative overflow-hidden border-t-2 border-black">
        {/* Grid Background */}
        <div className="absolute inset-0 bg-grid-pattern opacity-100 pointer-events-none"></div>
        
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white border-2 border-black shadow-hard"
            >
                {/* Document Header */}
                <div className="bg-black text-white p-6 border-b-2 border-black flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                             <div className="bg-[#CCFF00] text-black w-6 h-6 flex items-center justify-center border border-white">
                                <span className="font-bold font-mono text-xs leading-none">S</span>
                             </div>
                             <span className="font-bold font-mono text-sm tracking-wide text-white uppercase">Split Berlin</span>
                        </div>
                        <h2 className="text-2xl font-bold font-mono text-white tracking-tight uppercase">Communication Request</h2>
                        <p className="text-[#CCFF00] text-xs mt-1 font-mono uppercase">REF: CONTACT-{(new Date()).getFullYear()}-001</p>
                    </div>
                    <div className="hidden sm:block">
                        <div className="w-20 h-20 border-2 border-white flex items-center justify-center opacity-100">
                            <span className="font-mono font-bold text-white text-[10px] uppercase text-center leading-tight">Official<br/>Inquiry</span>
                        </div>
                    </div>
                </div>

                <div className="p-8 sm:p-12">
                    <AnimatePresence mode="wait">
                        {success ? (
                            <motion.div 
                                key="success"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="text-center py-12 flex flex-col items-center justify-center h-full min-h-[300px]"
                            >
                                <motion.div 
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", delay: 0.2 }}
                                    className="w-20 h-20 bg-[#CCFF00] flex items-center justify-center mb-6 border-2 border-black shadow-hard-sm"
                                >
                                    <CheckCircle2 className="w-10 h-10 text-black" />
                                </motion.div>
                                <h3 className="text-2xl font-bold font-mono text-black uppercase mb-2">{t.contact.sentTitle}</h3>
                                <p className="text-black font-mono mb-8 max-w-sm text-sm uppercase">{t.contact.sentDesc}</p>
                                
                                <button 
                                    onClick={() => setSuccess(false)}
                                    className="text-sm font-bold font-mono text-black uppercase hover:bg-[#CCFF00] hover:px-2 transition-all"
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
                                className="space-y-10"
                            >
                                {/* Section 1 */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3">
                                        <span className="bg-black text-white text-[10px] font-bold font-mono px-2 py-0.5 uppercase">SECTION 1</span>
                                        <h3 className="text-xs font-bold font-mono text-black uppercase tracking-widest">The Parties</h3>
                                        <div className="h-0.5 bg-black flex-grow"></div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                                        <div className="relative group">
                                            <label htmlFor="name" className={`block text-xs font-bold font-mono uppercase tracking-wider mb-1.5 transition-colors ${focusedField === 'name' ? 'text-black' : 'text-gray-500'}`}>
                                                {t.contact.name}
                                            </label>
                                            <input 
                                                id="name"
                                                type="text" 
                                                required
                                                onFocus={() => setFocusedField('name')}
                                                onBlur={() => setFocusedField(null)}
                                                className="w-full bg-white border-2 border-black px-3 py-3 text-black text-sm font-mono focus:bg-[#CCFF00] focus:outline-none transition-all placeholder:text-gray-400 uppercase"
                                                placeholder="ENTER FULL NAME..."
                                            />
                                        </div>
                                        <div className="relative group">
                                            <label htmlFor="email" className={`block text-xs font-bold font-mono uppercase tracking-wider mb-1.5 transition-colors ${focusedField === 'email' ? 'text-black' : 'text-gray-500'}`}>
                                                {t.contact.email}
                                            </label>
                                            <input 
                                                id="email"
                                                type="email" 
                                                required
                                                onFocus={() => setFocusedField('email')}
                                                onBlur={() => setFocusedField(null)}
                                                className="w-full bg-white border-2 border-black px-3 py-3 text-black text-sm font-mono focus:bg-[#CCFF00] focus:outline-none transition-all placeholder:text-gray-400 uppercase"
                                                placeholder="ENTER EMAIL ADDRESS..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Section 2 */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3">
                                        <span className="bg-black text-white text-[10px] font-bold font-mono px-2 py-0.5 uppercase">SECTION 2</span>
                                        <h3 className="text-xs font-bold font-mono text-black uppercase tracking-widest">The Details</h3>
                                        <div className="h-0.5 bg-black flex-grow"></div>
                                    </div>

                                    <div className="relative">
                                        <label htmlFor="message" className={`block text-xs font-bold font-mono uppercase tracking-wider mb-1.5 transition-colors ${focusedField === 'message' ? 'text-black' : 'text-gray-500'}`}>
                                            {t.contact.message}
                                        </label>
                                        <textarea 
                                            id="message"
                                            required
                                            rows={4}
                                            onFocus={() => setFocusedField('message')}
                                            onBlur={() => setFocusedField(null)}
                                            className="w-full bg-white border-2 border-black px-3 py-3 text-black text-sm font-mono focus:bg-[#CCFF00] focus:outline-none transition-all resize-none placeholder:text-gray-400 leading-relaxed uppercase"
                                            placeholder="DESCRIBE INQUIRY..."
                                        />
                                    </div>
                                </div>

                                {/* Footer / Sign */}
                                <div className="pt-6 border-t-2 border-dashed border-black mt-8">
                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                                        <div className="text-[10px] font-mono text-gray-500 max-w-xs uppercase text-center sm:text-left leading-relaxed">
                                            *By clicking submit, you acknowledge that while this form looks very official, it does not actually bind you to anything other than a friendly conversation.
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="group relative inline-flex items-center justify-center px-8 py-3 bg-black text-white text-sm font-bold font-mono uppercase border-2 border-black shadow-hard hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none hover:bg-white hover:text-black transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                                        >
                                            {loading ? (
                                                <span className="flex items-center gap-2">
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    TRANSMITTING...
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-2">
                                                    SEND REQUEST
                                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
