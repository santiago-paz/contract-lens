import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { AuthShell } from '@/components/auth/AuthShell';
import { openInvitationEmail } from '@/lib/invitations';
import { RegisterForm } from './RegisterForm';

export const metadata: Metadata = {
  title: 'Create an account | Contract Lens',
  robots: { index: false, follow: false },
};

/*
 * Sign-up is closed to the public. The page only opens for a visitor who
 * followed a live invitation link, and every other visit falls through to the
 * 404 page, so /register is a dead URL on its own. The same check guards the
 * register action in app/actions/auth.ts, because a form post never reaches
 * this file.
 */
export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { redirect, email } = await searchParams;

  const redirectTo = typeof redirect === 'string' ? redirect : undefined;
  const invitedEmail = await openInvitationEmail(
    redirectTo,
    typeof email === 'string' ? email : undefined,
  );

  if (!invitedEmail) {
    notFound();
  }

  return (
    <AuthShell
      title="Create your account."
      lead="You join the firm that invited you as soon as this is done."
    >
      <RegisterForm redirectTo={redirectTo} prefillEmail={invitedEmail} />
    </AuthShell>
  );
}
