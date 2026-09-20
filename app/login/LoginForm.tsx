'use client';

import Link from 'next/link';
import { useActionState } from 'react';

import { login } from '@/app/actions/auth';
import { Field, FormError, PasswordField, SubmitButton } from '@/components/auth/fields';

export function LoginForm({ redirectTo }: { redirectTo?: string }) {
  const [state, action, isPending] = useActionState(login, null);

  // Carry the visitor's destination across to sign-up, so someone who lands
  // here from a protected page still gets there after creating an account.
  const registerHref = redirectTo ? `/register?redirect=${encodeURIComponent(redirectTo)}` : '/register';

  return (
    <>
      <form action={action} className="space-y-5">
        {redirectTo && <input type="hidden" name="redirect" value={redirectTo} />}

        <Field
          id="email"
          name="email"
          type="email"
          label="Email"
          autoComplete="email"
          spellCheck={false}
          required
          maxLength={254}
          placeholder="name@firm.de"
        />

        <PasswordField
          id="password"
          name="password"
          label="Password"
          autoComplete="current-password"
          required
        />

        {state?.message && <FormError>{state.message}</FormError>}

        <div className="pt-1">
          <SubmitButton pending={isPending} pendingLabel="Signing in…">
            Sign in
          </SubmitButton>
        </div>
      </form>

      <p className="mt-8 border-t border-rule pt-6 text-small text-muted">
        New to Contract Lens?{' '}
        <Link
          href={registerHref}
          className="font-medium text-ink underline decoration-rule-strong underline-offset-4 transition-colors hover:decoration-ink"
        >
          Create an account
        </Link>
      </p>
    </>
  );
}
