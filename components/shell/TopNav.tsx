'use client';

import { useRef, useEffect, useState } from 'react';
import { Bell, ChevronDown, HelpCircle, LogOut, Plus, Search, User } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { logout } from '@/app/actions/auth';

export function TopNav({ user }: { user?: { name: string | null; email: string } | null }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const initials = user?.name 
    ? user.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase() 
    : user?.email?.substring(0, 2).toUpperCase() || '??';

  const displayName = user?.name || user?.email || 'User';

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  return (
    <header className="h-16 bg-white border-b border-black px-6 flex items-center justify-between sticky top-0 z-10">
      {/* Search */}
      <div className="flex items-center flex-1 max-w-xl">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black" />
          <input
            type="text"
            placeholder="SEARCH SYSTEM..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-black text-sm font-mono focus:outline-none focus:bg-[#CCFF00] focus:placeholder-black/50 transition-all placeholder:text-gray-400 uppercase"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 ml-6">
        {/* New Contract Button */}
        <Link
          href="/contract-creator"
          className="hidden sm:flex items-center gap-2 px-4 py-2 bg-black text-white border border-black shadow-hard hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all active:bg-[#CCFF00] active:text-black group"
        >
          <Plus className="w-4 h-4 group-active:text-black" />
          <span className="text-xs font-bold font-mono uppercase">New Contract</span>
        </Link>

        {/* Icons */}
        <div className="h-6 w-px bg-black mx-2" />

        <button className="p-2 text-black hover:bg-[#CCFF00] border border-transparent hover:border-black transition-colors relative">
          <Bell className="w-5 h-5" />
          {/* TODO: Uncomment when notification system is implemented */}
          {/* <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#CCFF00] border border-black"></span> */}
        </button>

        <button className="p-2 text-black hover:bg-[#CCFF00] border border-transparent hover:border-black transition-colors">
          <HelpCircle className="w-5 h-5" />
        </button>

        {/* User Profile Dropdown */}
        <div className="relative ml-2 pl-2 border-l border-gray-200" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen((open) => !open)}
            className="flex items-center gap-2 text-left w-full cursor-pointer"
            aria-expanded={dropdownOpen}
            aria-haspopup="true"
            aria-label="User menu"
          >
            <div className="w-8 h-8 bg-black text-[#CCFF00] flex items-center justify-center font-mono font-bold text-xs border border-black shadow-hard-sm">
              {initials}
            </div>
            <span className="text-xs font-bold font-mono text-black uppercase hidden md:block">{displayName}</span>
            <ChevronDown className={cn('w-4 h-4 text-black hidden md:block transition-transform', dropdownOpen && 'rotate-180')} />
          </button>
          {dropdownOpen && (
            <div
              className="absolute right-0 top-full mt-2 w-48 bg-white border border-black shadow-hard py-1 z-50 animate-fade-in-fast"
              role="menu"
            >
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-4 py-2 text-xs font-mono font-bold uppercase text-black hover:bg-[#CCFF00] transition-colors cursor-pointer"
                role="menuitem"
                onClick={() => setDropdownOpen(false)}
              >
                <User className="w-4 h-4" />
                Profile
              </Link>
              <button
                type="button"
                onClick={() => logout()}
                className="flex w-full items-center gap-2 px-4 py-2 text-xs font-mono font-bold uppercase text-black hover:bg-[#CCFF00] transition-colors cursor-pointer"
                role="menuitem"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
