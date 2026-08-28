'use server';

import { headers } from 'next/headers';
import { z } from 'zod';
import { resend, CONTACT_FROM } from '@/lib/email';

const CONTACT_TO = process.env.CONTACT_TO_EMAIL || 'santiago.paz.1992@gmail.com';

const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.email().max(254),
  message: z.string().trim().min(10).max(5000),
  // Honeypot: hidden in the UI, so a real visitor always leaves it empty.
  company: z.string().max(0),
});

export type ContactInput = z.input<typeof contactSchema>;

export type ContactResult =
  | { ok: true }
  | { ok: false; reason: 'invalid' | 'throttled' | 'failed' };

// Per-instance sliding window. Fluid Compute reuses instances, so this stops a
// naive flood, but it is not a shared counter across every running instance.
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const recentSubmissions = new Map<string, number[]>();

function isRateLimited(key: string, now: number) {
  const cutoff = now - RATE_LIMIT_WINDOW_MS;
  const hits = (recentSubmissions.get(key) ?? []).filter((at) => at > cutoff);

  if (hits.length >= RATE_LIMIT_MAX) {
    recentSubmissions.set(key, hits);
    return true;
  }

  hits.push(now);
  recentSubmissions.set(key, hits);

  // Keep the map from growing without bound on a long-lived instance.
  if (recentSubmissions.size > 5000) {
    for (const [entryKey, entryHits] of recentSubmissions) {
      if (entryHits.every((at) => at <= cutoff)) recentSubmissions.delete(entryKey);
    }
  }

  return false;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function sendContactMessage(input: ContactInput): Promise<ContactResult> {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) return { ok: false, reason: 'invalid' };

  const { name, email, message } = parsed.data;

  const headerList = await headers();
  const ip = headerList.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (isRateLimited(ip, Date.now())) return { ok: false, reason: 'throttled' };

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br />');
  const subjectName = name.replace(/[\r\n]+/g, ' ');

  const { error } = await resend.emails.send({
    from: CONTACT_FROM,
    to: CONTACT_TO,
    replyTo: email,
    subject: `Contact form: ${subjectName}`,
    text: `From: ${name} <${email}>\n\n${message}`,
    html: `
      <div style="font-family: monospace; max-width: 560px; margin: 0 auto; padding: 40px 20px;">
        <h2 style="font-size: 18px; margin-bottom: 24px;">New message from the landing page</h2>
        <p style="color: #333; line-height: 1.6; margin: 0 0 4px;"><strong>Name:</strong> ${safeName}</p>
        <p style="color: #333; line-height: 1.6; margin: 0 0 24px;">
          <strong>Email:</strong> <a href="mailto:${safeEmail}" style="color: #000;">${safeEmail}</a>
        </p>
        <div style="border-left: 2px solid #000; padding-left: 16px; color: #333; line-height: 1.6;">
          ${safeMessage}
        </div>
        <p style="margin-top: 24px; font-size: 12px; color: #666;">
          Reply to this email to answer ${safeName} directly.
        </p>
      </div>
    `,
  });

  if (error) {
    console.error('[contact] Resend rejected the message:', error);
    return { ok: false, reason: 'failed' };
  }

  return { ok: true };
}
