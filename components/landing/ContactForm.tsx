'use client';

import { useState } from 'react';
import { Loader2, CheckCircle2, ArrowRight, AlertTriangle } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { sendContactMessage } from '@/app/actions/contact';

const EMPTY_FORM = { name: '', email: '', message: '', company: '' };

type FormField = keyof typeof EMPTY_FORM;
type ContactError = 'invalid' | 'throttled' | 'failed';

export function ContactForm() {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<ContactError | null>(null);
  const [fields, setFields] = useState(EMPTY_FORM);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const errorMessage = error && {
    invalid: t.contact.errorInvalid,
    throttled: t.contact.errorThrottled,
    failed: t.contact.errorFailed,
  }[error];

  const updateField = (field: FormField, value: string) =>
    setFields((current) => ({ ...current, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await sendContactMessage(fields);
      if (result.ok) {
        setFields(EMPTY_FORM);
        setSuccess(true);
      } else {
        setError(result.reason);
      }
    } catch {
      setError('failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact-form" aria-labelledby="contact-title" className="scroll-mt-24 py-24 sm:py-32 bg-white relative overflow-hidden border-t-2 border-black bg-noise">
        {/* Grid Background */}
        <div className="absolute inset-0 bg-grid-pattern opacity-100 pointer-events-none" aria-hidden="true"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white border-2 border-black shadow-[12px_12px_0px_0px_#000]"
            >
                {/* Document Header */}
                <div className="bg-black text-white p-6 sm:p-8 border-b-2 border-black flex justify-between items-start relative overflow-hidden">
                    <div className="absolute right-0 top-0 px-6 opacity-10 select-none" aria-hidden="true">
                        <span className="font-mono font-black text-[140px] leading-none">§</span>
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                             <div className="bg-[#CCFF00] text-black w-8 h-8 flex items-center justify-center border-2 border-white" aria-hidden="true">
                                <span className="font-black font-mono text-sm leading-none">§</span>
                             </div>
                             <div className="flex flex-col">
                                <span className="font-bold font-mono text-sm tracking-widest text-white uppercase leading-none">Contract Lens</span>
                                <span className="text-[11px] font-mono text-[#CCFF00] uppercase tracking-wider mt-1">{t.contact.secureChannel}</span>
                             </div>
                        </div>
                        <h2 id="contact-title" className="text-3xl sm:text-4xl font-black font-mono text-white tracking-tight uppercase">{t.contact.headerTitle}</h2>
                    </div>

                    <div className="hidden sm:block relative z-10" aria-hidden="true">
                        <div className="w-24 h-24 border-2 border-white flex items-center justify-center rotate-2 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] bg-black">
                            <span className="font-mono font-bold text-white text-[11px] uppercase text-center leading-tight tracking-wider">
                                {t.contact.officialInquiry.split(' ').map((word, i) => (
                                    <span key={i} className="block">{word}</span>
                                ))}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="p-8 sm:p-12 bg-white relative">
                    {/* Decorative margin line */}
                    <div className="absolute left-8 sm:left-12 top-0 bottom-0 w-px bg-red-500/20 pointer-events-none hidden sm:block" aria-hidden="true"></div>

                    <AnimatePresence mode="wait">
                        {success ? (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                role="status"
                                className="text-center py-12 flex flex-col items-center justify-center h-full min-h-[400px] sm:pl-8"
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", delay: 0.2 }}
                                    className="w-24 h-24 bg-[#CCFF00] flex items-center justify-center mb-8 border-2 border-black shadow-hard"
                                >
                                    <CheckCircle2 className="w-12 h-12 text-black" aria-hidden="true" />
                                </motion.div>
                                <h3 className="text-3xl font-black font-mono text-black uppercase mb-4 tracking-tight">{t.contact.sentTitle}</h3>
                                <p className="text-black font-mono mb-10 max-w-sm text-sm leading-relaxed border-l-2 border-black pl-4">
                                    {t.contact.sentDesc}
                                </p>

                                <button
                                    onClick={() => { setSuccess(false); setError(null); }}
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
                                        <span className="bg-black text-white text-xs font-bold font-mono px-3 py-1">{t.contact.section1}</span>
                                        <h3 className="text-sm font-bold font-mono text-black uppercase tracking-widest border-b-2 border-black pb-1 flex-grow">{t.contact.theParties}</h3>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8">
                                        <div className="relative">
                                            <label htmlFor="name" className={`block text-xs font-bold font-mono uppercase tracking-wider mb-2 transition-colors ${focusedField === 'name' ? 'text-black' : 'text-gray-600'}`}>
                                                {t.contact.name}
                                            </label>
                                            <input
                                                id="name"
                                                type="text"
                                                required
                                                maxLength={100}
                                                autoComplete="name"
                                                value={fields.name}
                                                onChange={(e) => updateField('name', e.target.value)}
                                                onFocus={() => setFocusedField('name')}
                                                onBlur={() => setFocusedField(null)}
                                                className="w-full bg-gray-50 border-2 border-black px-4 py-4 text-black text-sm font-mono focus:bg-[#CCFF00] transition-colors placeholder:text-gray-500 shadow-sm"
                                                placeholder={t.contact.enterFullName}
                                            />
                                        </div>
                                        <div className="relative">
                                            <label htmlFor="email" className={`block text-xs font-bold font-mono uppercase tracking-wider mb-2 transition-colors ${focusedField === 'email' ? 'text-black' : 'text-gray-600'}`}>
                                                {t.contact.email}
                                            </label>
                                            <input
                                                id="email"
                                                type="email"
                                                required
                                                maxLength={254}
                                                autoComplete="email"
                                                spellCheck={false}
                                                value={fields.email}
                                                onChange={(e) => updateField('email', e.target.value)}
                                                onFocus={() => setFocusedField('email')}
                                                onBlur={() => setFocusedField(null)}
                                                className="w-full bg-gray-50 border-2 border-black px-4 py-4 text-black text-sm font-mono focus:bg-[#CCFF00] transition-colors placeholder:text-gray-500 shadow-sm"
                                                placeholder={t.contact.enterEmail}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Section 2 */}
                                <div className="space-y-8">
                                    <div className="flex items-center gap-4">
                                        <span className="bg-black text-white text-xs font-bold font-mono px-3 py-1">{t.contact.section2}</span>
                                        <h3 className="text-sm font-bold font-mono text-black uppercase tracking-widest border-b-2 border-black pb-1 flex-grow">{t.contact.theDetails}</h3>
                                    </div>

                                    <div className="relative">
                                        <label htmlFor="message" className={`block text-xs font-bold font-mono uppercase tracking-wider mb-2 transition-colors ${focusedField === 'message' ? 'text-black' : 'text-gray-600'}`}>
                                            {t.contact.message}
                                        </label>
                                        <textarea
                                            id="message"
                                            required
                                            rows={5}
                                            minLength={10}
                                            maxLength={5000}
                                            value={fields.message}
                                            onChange={(e) => updateField('message', e.target.value)}
                                            onFocus={() => setFocusedField('message')}
                                            onBlur={() => setFocusedField(null)}
                                            className="w-full bg-gray-50 border-2 border-black px-4 py-4 text-black text-sm font-mono focus:bg-[#CCFF00] transition-colors resize-none placeholder:text-gray-500 leading-relaxed shadow-sm"
                                            placeholder={t.contact.describeInquiry}
                                        />
                                    </div>
                                </div>

                                <div hidden>
                                    <label htmlFor="company">Company</label>
                                    <input
                                        id="company"
                                        name="company"
                                        type="text"
                                        tabIndex={-1}
                                        autoComplete="off"
                                        value={fields.company}
                                        onChange={(e) => updateField('company', e.target.value)}
                                    />
                                </div>

                                {errorMessage && (
                                    <div
                                        role="alert"
                                        className="flex items-start gap-3 border-2 border-black bg-red-50 px-4 py-3 shadow-hard-sm"
                                    >
                                        <AlertTriangle className="w-5 h-5 shrink-0 text-black mt-px" aria-hidden="true" />
                                        <p className="text-xs font-mono font-bold text-black leading-relaxed">
                                            {errorMessage}
                                        </p>
                                    </div>
                                )}

                                {/* Footer / Sign */}
                                <div className="pt-8 border-t-2 border-black mt-8 bg-gray-50 -mx-8 sm:-mx-12 px-8 sm:px-12 pb-2">
                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
                                        <p className="text-[11px] font-mono text-gray-600 max-w-xs text-center sm:text-left leading-relaxed">
                                            {t.contact.disclaimer}
                                        </p>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full sm:w-auto group relative inline-flex items-center justify-center px-10 py-4 bg-black text-white text-sm font-bold font-mono uppercase border-2 border-black shadow-hard hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none hover:bg-[#CCFF00] hover:text-black transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                                        >
                                            {loading ? (
                                                <span className="flex items-center gap-2">
                                                    <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                                                    {t.contact.submitting}
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-2">
                                                    {t.contact.submitButton}
                                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
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
    </section>
  );
}
