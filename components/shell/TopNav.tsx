'use client';

import { Bell, ChevronDown, HelpCircle, Plus, Search } from 'lucide-react';
import Link from 'next/link';

export function TopNav() {
  return (
    <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-10">
      {/* Search */}
      <div className="flex items-center flex-1 max-w-xl">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search for Contract Data, Partners, ..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 ml-6">
        {/* New Contract Button */}
        <Link
          href="/contract-creator"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Contract</span>
        </Link>

        {/* Icons */}
        <div className="h-6 w-px bg-gray-200 mx-2" />

        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
          <HelpCircle className="w-5 h-5" />
        </button>

        {/* User Profile */}
        <button className="flex items-center gap-2 ml-2 pl-2 border-l border-transparent md:border-gray-100">
          <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-semibold text-xs border border-amber-200">
            IC
          </div>
          <span className="text-sm font-medium text-gray-700 hidden md:block">Irem Cengiz</span>
          <ChevronDown className="w-4 h-4 text-gray-400 hidden md:block" />
        </button>
      </div>
    </header>
  );
}
