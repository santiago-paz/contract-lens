'use client';

import { useState } from 'react';
import { Send, Loader2, CheckCircle2, FileText, PenTool } from 'lucide-react';
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
    <div id="contact-form" className="py-24 bg-gray-50 relative overflow-hidden border-t border-gray-200">
        {/* Decorative elements */}
        <div className="absolute top-0 inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-50"></div>
        
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden relative ring-1 ring-gray-900/5"
                style={{ 
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
                }}
            >
                {/* Document Header */}
                <div className="bg-gray-50/50 border-b border-gray-100 p-8 flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                             <div className="bg-blue-600 text-white w-6 h-6 rounded-md flex items-center justify-center shadow-md shadow-blue-600/20">
                                <span className="font-bold text-xs leading-none">S</span>
                             </div>
                             <span className="font-bold text-sm tracking-wide text-gray-900">Split Berlin</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Communication Request</h2>
                        <p className="text-gray-500 text-xs mt-1 font-mono">REF: CONTACT-{(new Date()).getFullYear()}-001</p>
                    </div>
                    <div className="hidden sm:block">
                        <div className="w-20 h-20 border-4 border-double border-gray-200 rounded-full flex items-center justify-center rotate-12 opacity-30">
                            <span className="font-serif font-bold text-gray-400 text-[10px] uppercase text-center leading-tight">Official<br/>Inquiry</span>
                        </div>
                    </div>
                </div>

                <div className="p-8">
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
                                    className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6 border-4 border-green-100"
                                >
                                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                                </motion.div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{t.contact.sentTitle}</h3>
                                <p className="text-gray-600 mb-8 max-w-sm text-sm">{t.contact.sentDesc}</p>
                                
                                <button 
                                    onClick={() => setSuccess(false)}
                                    className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors"
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
                                        <span className="bg-gray-900 text-white text-[10px] font-bold px-2 py-0.5 rounded">SECTION 1</span>
                                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">The Parties</h3>
                                        <div className="h-px bg-gray-100 flex-grow"></div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                                        <div className="relative group">
                                            <label htmlFor="name" className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 transition-colors ${focusedField === 'name' ? 'text-blue-600' : 'text-gray-500'}`}>
                                                {t.contact.name}
                                            </label>
                                            <input 
                                                id="name"
                                                type="text" 
                                                required
                                                onFocus={() => setFocusedField('name')}
                                                onBlur={() => setFocusedField(null)}
                                                className="w-full bg-gray-50/50 border border-gray-200 rounded-lg px-3 py-2.5 text-gray-900 text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-gray-400"
                                                placeholder="Enter full name..."
                                            />
                                        </div>
                                        <div className="relative group">
                                            <label htmlFor="email" className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 transition-colors ${focusedField === 'email' ? 'text-blue-600' : 'text-gray-500'}`}>
                                                {t.contact.email}
                                            </label>
                                            <input 
                                                id="email"
                                                type="email" 
                                                required
                                                onFocus={() => setFocusedField('email')}
                                                onBlur={() => setFocusedField(null)}
                                                className="w-full bg-gray-50/50 border border-gray-200 rounded-lg px-3 py-2.5 text-gray-900 text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-gray-400"
                                                placeholder="Enter email address..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Section 2 */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3">
                                        <span className="bg-gray-900 text-white text-[10px] font-bold px-2 py-0.5 rounded">SECTION 2</span>
                                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">The Details</h3>
                                        <div className="h-px bg-gray-100 flex-grow"></div>
                                    </div>

                                    <div className="relative">
                                        <label htmlFor="message" className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 transition-colors ${focusedField === 'message' ? 'text-blue-600' : 'text-gray-500'}`}>
                                            {t.contact.message}
                                        </label>
                                        <textarea 
                                            id="message"
                                            required
                                            rows={4}
                                            onFocus={() => setFocusedField('message')}
                                            onBlur={() => setFocusedField(null)}
                                            className="w-full bg-gray-50/50 border border-gray-200 rounded-lg px-3 py-2.5 text-gray-900 text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none placeholder:text-gray-400 leading-relaxed"
                                            placeholder="Please describe the nature of your inquiry..."
                                        />
                                    </div>
                                </div>

                                {/* Footer / Sign */}
                                <div className="pt-6 border-t border-dashed border-gray-200 mt-8">
                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                                        <div className="text-[10px] text-gray-400 max-w-xs italic text-center sm:text-left leading-relaxed">
                                            *By clicking submit, you acknowledge that while this form looks very official, it does not actually bind you to anything other than a friendly conversation. No lawyers were harmed in the making of this HTML.
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="group relative inline-flex items-center justify-center px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                                        >
                                            {loading ? (
                                                <span className="flex items-center gap-2">
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    Sending...
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-2">
                                                    Send Request
                                                    <ArrowRightCustom className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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

function ArrowRightCustom({ className }: { className?: string }) {
    return (
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className={className}
        >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
        </svg>
    )
}
