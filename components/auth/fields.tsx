'use client';

import { AlertTriangle, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useState } from 'react';

/**
 * The form parts the sign-in and sign-up pages share. They are the landing's
 * own field, error box and pill button, so the door into the app is set in the
 * same type and the same colours as the page a visitor arrives from.
 */

/* The hairline is decorative; a field's edge is the control itself, so it takes rule-strong for 3:1 against white. */
const FIELD_CLASS =
  'w-full rounded-[10px] border border-rule-strong bg-paper px-4 py-3 text-copy leading-[1.5] text-ink placeholder:text-muted transition-colors focus:border-ink read-only:bg-ledger read-only:text-muted';

type FieldProps = React.ComponentPropsWithoutRef<'input'> & {
  id: string;
  label: string;
  hint?: string;
};

export function Field({ id, label, hint, className = '', ...input }: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-small font-medium text-ink">
        {label}
      </label>
      <input
        id={id}
        aria-describedby={hint ? `${id}-hint` : undefined}
        className={`${FIELD_CLASS} ${className}`}
        {...input}
      />
      {hint && (
        <p id={`${id}-hint`} className="mt-1.5 text-small text-muted">
          {hint}
        </p>
      )}
    </div>
  );
}

/**
 * The same field with a reveal button. A password typed blind is the one place
 * in this form where a visitor cannot check their own work, so the control sits
 * inside the field rather than beside the label.
 */
export function PasswordField({ id, label, hint, className = '', ...input }: FieldProps) {
  const [shown, setShown] = useState(false);

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-small font-medium text-ink">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={shown ? 'text' : 'password'}
          aria-describedby={hint ? `${id}-hint` : undefined}
          className={`${FIELD_CLASS} pr-12 ${className}`}
          {...input}
        />
        <button
          type="button"
          onClick={() => setShown((value) => !value)}
          aria-label={shown ? 'Hide password' : 'Show password'}
          aria-pressed={shown}
          className="absolute right-1.5 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-muted transition-colors hover:text-ink"
        >
          {shown ? (
            <EyeOff className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden="true" />
          ) : (
            <Eye className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden="true" />
          )}
        </button>
      </div>
      {hint && (
        <p id={`${id}-hint`} className="mt-1.5 text-small text-muted">
          {hint}
        </p>
      )}
    </div>
  );
}

/** What went wrong, in the landing's error box: red wash, red hairline, ink text. */
export function FormError({ children }: { children: React.ReactNode }) {
  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-[10px] border border-beck/40 bg-beck-tint px-4 py-3"
    >
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-beck" aria-hidden="true" />
      <p className="text-small text-ink">{children}</p>
    </div>
  );
}

export function SubmitButton({
  pending,
  pendingLabel,
  children,
}: {
  pending: boolean;
  pendingLabel: string;
  children: React.ReactNode;
}) {
  return (
    <button type="submit" disabled={pending} className="btn btn-primary w-full">
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          {pendingLabel}
        </>
      ) : (
        children
      )}
    </button>
  );
}
