'use client'

import { useActionState, useState } from 'react'
import { login } from '@/app/actions/auth'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Loader2, Terminal, ShieldCheck } from 'lucide-react'

export default function LoginPage() {
  const [state, action, isPending] = useActionState(login, null)
  const [focusedField, setFocusedField] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-white relative overflow-hidden flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-100 pointer-events-none"></div>

      {/* Back Link */}
      <Link 
        href="/"
        className="absolute left-4 top-4 sm:left-8 sm:top-8 inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-black shadow-hard-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all z-20"
      >
        <ArrowLeft className="w-4 h-4 text-black" />
        <span className="text-xs font-bold font-mono text-black uppercase tracking-wide">Return to Base</span>
      </Link>

      <div 
        className="w-full max-w-md relative z-10 animate-fade-in-up"
      >
        <div className="bg-white border-2 border-black shadow-hard">
            {/* Header */}
            <div className="bg-black text-white p-6 border-b-2 border-black">
                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-2">
                        <div className="bg-[#CCFF00] text-black w-8 h-8 flex items-center justify-center border border-white">
                            <span className="font-bold font-mono text-lg leading-none">S</span>
                        </div>
                        <span className="font-bold font-mono text-sm tracking-wide text-white uppercase">Blackletter</span>
                    </div>
                    <div className="flex items-center gap-1 px-2 py-1 bg-[#CCFF00] text-black text-[10px] font-bold font-mono uppercase">
                        <ShieldCheck className="w-3 h-3" />
                        SECURE
                    </div>
                </div>
                
                <h2 className="text-2xl font-bold font-mono text-white tracking-tight uppercase">System Access</h2>
                <div className="flex items-center gap-2 mt-2">
                    <Terminal className="w-3 h-3 text-[#CCFF00]" />
                    <p className="text-[#CCFF00] text-xs font-mono uppercase">AUTHENTICATION_PROTOCOL_V2</p>
                </div>
            </div>

            <div className="p-8">
                <form action={action} className="space-y-6">
                    {/* Email Input */}
                    <div className="space-y-2">
                        <label 
                            htmlFor="email" 
                            className={`block text-xs font-bold font-mono uppercase tracking-wider transition-colors ${focusedField === 'email' ? 'text-black' : 'text-gray-500'}`}
                        >
                            Identifier (Email)
                        </label>
                        <div className="relative">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                onFocus={() => setFocusedField('email')}
                                onBlur={() => setFocusedField(null)}
                                className="w-full bg-white border-2 border-black px-3 py-3 text-black text-sm font-mono focus:bg-[#CCFF00] focus:outline-none transition-all placeholder:text-gray-400 uppercase"
                                placeholder="ENTER IDENTIFIER..."
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div className="space-y-2">
                        <label 
                            htmlFor="password" 
                            className={`block text-xs font-bold font-mono uppercase tracking-wider transition-colors ${focusedField === 'password' ? 'text-black' : 'text-gray-500'}`}
                        >
                            Access Key (Password)
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                onFocus={() => setFocusedField('password')}
                                onBlur={() => setFocusedField(null)}
                                className="w-full bg-white border-2 border-black px-3 py-3 text-black text-sm font-mono focus:bg-[#CCFF00] focus:outline-none transition-all placeholder:text-gray-400 uppercase"
                                placeholder="ENTER KEY..."
                            />
                        </div>
                    </div>

                    {/* Error Message */}
                    {state?.message && (
                        <div className="bg-red-50 border-2 border-red-500 p-4 relative overflow-hidden">
                             <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
                             <div className="flex gap-3">
                                <div className="text-red-600 font-bold font-mono uppercase text-xs">Error:</div>
                                <p className="text-xs font-mono text-red-600 uppercase">{state.message}</p>
                             </div>
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full group relative inline-flex items-center justify-center px-8 py-4 bg-black text-white text-sm font-bold font-mono uppercase border-2 border-black shadow-hard hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none hover:bg-white hover:text-black transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {isPending ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    AUTHENTICATING...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    INITIALIZE SESSION
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </span>
                            )}
                        </button>
                    </div>
                </form>
            </div>
            
            {/* Footer of the card */}
            <div className="bg-gray-50 px-8 py-4 border-t-2 border-black">
                 <div className="flex justify-between items-center text-[10px] font-mono uppercase text-gray-500">
                    <span>SECURE CONNECTION</span>
                    <span>ENCRYPTED_SHA256</span>
                 </div>
            </div>
        </div>
      </div>
    </div>
  )
}
