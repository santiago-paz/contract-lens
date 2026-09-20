'use client';

import Link from 'next/link';
import { useActionState } from 'react';

import { register } from '@/app/actions/auth';
import { Field, FormError, PasswordField, SubmitButton } from '@/components/auth/fields';

export function RegisterForm({
  redirectTo,
  prefillEmail,
}: {
  redirectTo?: string;
  prefillEmail?: string;
}) {
  const [state, action, isPending] = useActionState(register, null);

  const loginHref = redirectTo ? `/login?redirect=${encodeURIComponent(redirectTo)}` : '/login';

  return (
    <>
      <form action={action} className="space-y-5">
        {redirectTo && <input type="hidden" name="redirect" value={redirectTo} />}

        <Field
          id="name"
          name="name"
          type="text"
          label="Full name"
          autoComplete="name"
          required
          minLength={2}
          maxLength={100}
          placeholder="Your name"
        />

        {/* An invited colleague signs up against the address they were invited at, so that field is fixed. */}
        <Field
          id="email"
          name="email"
          type="email"
          label="Email"
          autoComplete="email"
          spellCheck={false}
          required
          maxLength={254}
          defaultValue={prefillEmail}
          readOnly={Boolean(prefillEmail)}
          placeholder="name@firm.de"
          hint={prefillEmail ? 'Your invitation went to this address.' : undefined}
        />

        <PasswordField
          id="password"
          name="password"
          label="Password"
          autoComplete="new-password"
          required
          minLength={8}
          hint="At least 8 characters."
        />

        <PasswordField
          id="confirmPassword"
          name="confirmPassword"
          label="Repeat password"
          autoComplete="new-password"
          required
          minLength={8}
        />

        {state?.message && <FormError>{state.message}</FormError>}

        <div className="pt-1">
          <SubmitButton pending={isPending} pendingLabel="Creating account…">
            Create account
          </SubmitButton>
        </div>
      </form>

      <p className="mt-8 border-t border-rule pt-6 text-small text-muted">
        Already have an account?{' '}
        <Link
          href={loginHref}
          className="font-medium text-ink underline decoration-rule-strong underline-offset-4 transition-colors hover:decoration-ink"
        >
          Sign in
        </Link>
      </p>
    </>
  );
}
