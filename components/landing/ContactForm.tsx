'use client';

import { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { useLanguage } from './LanguageContext';

export function ContactForm() {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

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
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-blue-50 to-transparent pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-white border border-gray-200 rounded-2xl p-8 sm:p-12 shadow-xl">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">{t.contact.title}</h2>
                <p className="text-gray-600">{t.contact.subtitle}</p>
            </div>

            {success ? (
                <div className="text-center py-12">
                    <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-100">
                        <Send className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{t.contact.sentTitle}</h3>
                    <p className="text-gray-600">{t.contact.sentDesc}</p>
                    <button 
                        onClick={() => setSuccess(false)}
                        className="mt-6 text-blue-600 hover:text-blue-500 font-medium"
                    >
                        {t.contact.sendAnother}
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-medium text-gray-700">{t.contact.name}</label>
                            <input 
                                id="name"
                                type="text" 
                                required
                                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                                placeholder="Jane Doe"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium text-gray-700">{t.contact.email}</label>
                            <input 
                                id="email"
                                type="email" 
                                required
                                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                                placeholder="jane@company.com"
                            />
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <label htmlFor="message" className="text-sm font-medium text-gray-700">{t.contact.message}</label>
                        <textarea 
                            id="message"
                            required
                            rows={4}
                            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400 resize-none"
                            placeholder={t.contact.placeholder}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                {t.contact.sending}
                            </>
                        ) : (
                            <>
                                {t.contact.send}
                                <Send className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </form>
            )}
        </div>
      </div>
    </div>
  );
}
