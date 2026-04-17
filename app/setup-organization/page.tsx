'use client';

import { useActionState } from 'react';
import { createOrganization } from '@/app/actions/organization';
import { Building2 } from 'lucide-react';

export default function SetupOrganizationPage() {
  const [state, formAction, isPending] = useActionState(createOrganization, null);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-black mb-4">
            <Building2 className="w-6 h-6 text-[#CCFF00]" />
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-black">
            Create Your Organization
          </h1>
          <p className="text-sm text-gray-500 mt-2 uppercase font-medium">
            Set up your workspace to start managing contracts
          </p>
        </div>

        {/* Form */}
        <form action={formAction} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2"
            >
              Organization Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              minLength={2}
              maxLength={100}
              placeholder="e.g. Acme Corp"
              className="w-full px-4 py-3 border border-black bg-white text-black font-mono text-sm placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#CCFF00] focus:border-black"
            />
          </div>

          {state?.error && (
            <div className="px-4 py-3 border border-red-300 bg-red-50 text-red-700 text-xs font-mono uppercase">
              {state.error}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full px-4 py-3 bg-black text-white border border-black shadow-hard hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all active:bg-[#CCFF00] active:text-black disabled:opacity-50 disabled:cursor-not-allowed text-xs font-bold font-mono uppercase"
          >
            {isPending ? 'Creating...' : 'Create Organization'}
          </button>
        </form>
      </div>
    </div>
  );
}
