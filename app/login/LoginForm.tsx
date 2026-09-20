'use client';

import Link from 'next/link';
import { useActionState } from 'react';

import { login } from '@/app/actions/auth';
import { Field, FormError, PasswordField, SubmitButton } from '@/components/auth/fields';

export function LoginForm({ redirectTo }: { redirectTo?: string }) {
  const [state, action, isPending] = useActionState(login, null);

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

      {/* Sign-up is closed, so there is no link to it. An account comes from an
          invitation sent by a firm that already uses Contract Lens. */}
      <p className="mt-8 border-t border-rule pt-6 text-small text-muted">
        New to Contract Lens? You need an invitation from your firm. Ask a colleague, or{' '}
        <Link
          href="/#contact"
          className="font-medium text-ink underline decoration-rule-strong underline-offset-4 transition-colors hover:decoration-ink"
        >
          get in touch
        </Link>
        .
      </p>
    </>
  );
}
