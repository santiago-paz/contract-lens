import type { Metadata } from 'next';

import { AuthShell } from '@/components/auth/AuthShell';
import { LoginForm } from './LoginForm';

export const metadata: Metadata = {
  title: 'Sign in | Contract Lens',
  robots: { index: false, follow: false },
};

/*
 * A server page on purpose. The landing's fonts are called from the shell, so
 * Next preloads them on this route, and `redirect` is read here rather than
 * through useSearchParams, which would leave the form blank until hydration.
 */
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { redirect } = await searchParams;

  return (
    <AuthShell title="Sign in to your firm's account.">
      <LoginForm redirectTo={typeof redirect === 'string' ? redirect : undefined} />
    </AuthShell>
  );
}
