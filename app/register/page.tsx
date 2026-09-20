import type { Metadata } from 'next';

import { AuthShell } from '@/components/auth/AuthShell';
import { RegisterForm } from './RegisterForm';

export const metadata: Metadata = {
  title: 'Create an account | Contract Lens',
  robots: { index: false, follow: false },
};

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { redirect, email } = await searchParams;

  return (
    <AuthShell
      title="Create your account."
      lead="You name your firm in the next step, or join the one that invited you."
    >
      <RegisterForm
        redirectTo={typeof redirect === 'string' ? redirect : undefined}
        prefillEmail={typeof email === 'string' ? email : undefined}
      />
    </AuthShell>
  );
}
