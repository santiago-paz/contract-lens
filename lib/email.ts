import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY);

// trycontractlens.com is verified in Resend with DKIM and SPF, so mail from it
// reaches any recipient. Resend's shared sandbox sender, onboarding@resend.dev,
// only ever delivers to the address the Resend account is registered under and
// returns a 403 for everyone else.
const MAIL_DOMAIN = 'trycontractlens.com';

function sender(mailbox: string, override?: string) {
  return `Contract Lens <${override || `${mailbox}@${MAIL_DOMAIN}`}>`;
}

// Landing-page contact form.
export const CONTACT_FROM = sender('contact', process.env.CONTACT_FROM_EMAIL);

// Team invitations.
export const INVITE_FROM = sender('invites', process.env.INVITE_FROM_EMAIL);
