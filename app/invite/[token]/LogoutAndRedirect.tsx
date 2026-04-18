'use client';

import { useState } from 'react';
import { logout } from '@/app/actions/auth';
import { Loader2 } from 'lucide-react';

export function LogoutAndRedirect({ href, label }: { href: string; label: string }) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    // Clear the session cookie, then redirect manually
    // (logout() does redirect('/login') by default, so we override by navigating ourselves)
    document.cookie = 'auth_session=; path=/; max-age=0';
    window.location.href = href;
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="block w-full text-center py-3 bg-black text-white font-bold font-mono uppercase tracking-wider text-sm border-2 border-black shadow-hard-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all disabled:opacity-50"
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          Redirecting...
        </span>
      ) : (
        label
      )}
    </button>
  );
}
