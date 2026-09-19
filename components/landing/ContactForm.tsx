'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, Check, Loader2 } from 'lucide-react';
import { useState } from 'react';

import { sendContactMessage } from '@/app/actions/contact';
import { useLanguage } from './LanguageContext';
import { DUR, EASE } from './motion';
import { Section } from './Section';

const EMPTY_FORM = { name: '', email: '', message: '', company: '' };

type FormField = keyof typeof EMPTY_FORM;
type ContactError = 'invalid' | 'throttled' | 'failed';

const FIELD_CLASS =
  'w-full rounded-[10px] border border-rule-strong bg-paper px-4 py-3 text-copy leading-[1.5] text-ink placeholder:text-muted transition-colors focus:border-ink';

export function ContactForm() {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<ContactError | null>(null);
  const [fields, setFields] = useState(EMPTY_FORM);

  const errorMessage =
    error &&
    {
      invalid: t.contact.errorInvalid,
      throttled: t.contact.errorThrottled,
      failed: t.contact.errorFailed,
    }[error];

  const updateField = (field: FormField, value: string) =>
    setFields((current) => ({ ...current, [field]: value }));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
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
    <Section
      id="contact"
      title={t.contact.title}
      summary={t.contact.body}
      tone="navy"
      layout="split"
    >
      {/* The form is a sheet on the navy block, so it keeps the light palette and the dark focus ring. */}
      <div className="on-paper rounded-[20px] bg-paper p-6 text-ink shadow-sheet sm:p-8">
        {/* initial={false}: the form is there from the first paint; only the switch to the sent note fades. */}
        <AnimatePresence mode="wait" initial={false}>
          {success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: DUR.quick, ease: EASE }}
              role="status"
              className="py-4"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-ink text-paper">
                <Check className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="display mt-5 text-[1.75rem] leading-[1.15] text-ink">{t.contact.sentTitle}</h3>
              <p className="mt-2 text-copy text-body">{t.contact.sentBody}</p>
              <button
                type="button"
                onClick={() => {
                  setSuccess(false);
                  setError(null);
                }}
                className="btn btn-secondary btn-sm mt-6"
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
              transition={{ duration: DUR.quick, ease: EASE }}
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="mb-1.5 block text-small font-medium text-ink">
                    {t.contact.name}
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    maxLength={100}
                    autoComplete="name"
                    value={fields.name}
                    onChange={(event) => updateField('name', event.target.value)}
                    className={FIELD_CLASS}
                    placeholder={t.contact.namePlaceholder}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="mb-1.5 block text-small font-medium text-ink">
                    {t.contact.email}
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    maxLength={254}
                    autoComplete="email"
                    spellCheck={false}
                    value={fields.email}
                    onChange={(event) => updateField('email', event.target.value)}
                    className={FIELD_CLASS}
                    placeholder={t.contact.emailPlaceholder}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="mb-1.5 block text-small font-medium text-ink">
                  {t.contact.message}
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  minLength={10}
                  maxLength={5000}
                  value={fields.message}
                  onChange={(event) => updateField('message', event.target.value)}
                  className={`${FIELD_CLASS} resize-y leading-[1.5]`}
                  placeholder={t.contact.messagePlaceholder}
                />
              </div>

              {/* Honeypot: hidden from people, so a real visitor always leaves it empty. */}
              <div hidden>
                <label htmlFor="company">Company</label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={fields.company}
                  onChange={(event) => updateField('company', event.target.value)}
                />
              </div>

              {errorMessage && (
                <div
                  role="alert"
                  className="flex items-start gap-3 rounded-[10px] border border-beck/40 bg-beck-tint px-4 py-3"
                >
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-beck" aria-hidden="true" />
                  <p className="text-small text-ink">{errorMessage}</p>
                </div>
              )}

              <div className="flex flex-col gap-4 pt-1 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-small text-muted">{t.contact.note}</p>
                <button type="submit" disabled={loading} className="btn btn-primary">
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                      {t.contact.submitting}
                    </>
                  ) : (
                    t.contact.submit
                  )}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </Section>
  );
}
