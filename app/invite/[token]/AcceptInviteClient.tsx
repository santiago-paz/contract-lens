'use client';

import { useState } from 'react';
import { acceptInvitation } from '@/app/actions/organization';
import { Loader2 } from 'lucide-react';

export function AcceptInviteClient({ token }: { token: string }) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleAccept() {
    setLoading(true);
    setError(null);
    const result = await acceptInvitation(token);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
    // On success, acceptInvitation redirects to /dashboard
  }

  return (
    <>
      {error && (
        <p className="text-sm text-red-600 font-mono mb-4 p-3 border border-red-300 bg-red-50">
          {error}
        </p>
      )}
      <button
        onClick={handleAccept}
        disabled={loading}
        className="w-full py-3 bg-[#CCFF00] text-black font-bold font-mono uppercase tracking-wider border-2 border-black shadow-hard-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Joining...
          </>
        ) : (
          'Accept & Join'
        )}
      </button>
    </>
  );
}
