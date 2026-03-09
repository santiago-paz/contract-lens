'use client';

import { Search, Filter, X } from 'lucide-react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

export function ContractFilters() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [showFilters, setShowFilters] = useState(false);
  const [inputValue, setInputValue] = useState(searchParams.get('q')?.toString() || '');
  
  // Debounce logic
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearch = (term: string) => {
    setInputValue(term);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      if (term) {
        params.set('q', term);
      } else {
        params.delete('q');
      }
      replace(`${pathname}?${params.toString()}`);
    }, 300);
  };

  const handleStatusFilter = (status: string | null) => {
    const params = new URLSearchParams(searchParams);
    if (status) {
      params.set('status', status);
    } else {
      params.delete('status');
    }
    // Reset page to 1 if we had pagination (not yet, but good practice)
    // params.set('page', '1'); 
    replace(`${pathname}?${params.toString()}`);
  };

  const currentStatus = searchParams.get('status');
  const hasActiveFilters = !!currentStatus;

  return (
    <div className="space-y-4">
      <div className="bg-white p-1 rounded-sm shadow-sm border border-gray-200 flex flex-col sm:flex-row gap-2 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2.5 border-0 bg-transparent text-sm focus:ring-0 placeholder:text-gray-400 placeholder:uppercase placeholder:text-xs font-medium focus:outline-none"
            placeholder="Search contracts..."
            value={inputValue}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <div className="h-6 w-px bg-gray-200 hidden sm:block"></div>
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2 hover:text-black hover:bg-gray-50 transition-colors text-xs font-bold uppercase w-full sm:w-auto justify-center rounded-sm ${showFilters || hasActiveFilters ? 'text-black bg-gray-50' : 'text-gray-600'}`}
        >
          <Filter className="w-3 h-3" />
          Filters
          {hasActiveFilters && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#CCFF00] ml-0.5" />
          )}
        </button>
      </div>

      {/* Expandable Filters Area */}
      {(showFilters || hasActiveFilters) && (
        <div className="bg-white border border-gray-200 rounded-sm p-4 shadow-sm animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase mb-2 block">Status</label>
              <div className="flex flex-wrap gap-2">
                {['All', 'Draft', 'Review', 'Active', 'Completed', 'Archived'].map((status) => {
                  const value = status === 'All' ? null : status;
                  const isActive = currentStatus === value || (status === 'All' && !currentStatus);
                  
                  return (
                    <button
                      key={status}
                      onClick={() => handleStatusFilter(value)}
                      className={`px-3 py-1.5 text-xs font-bold uppercase rounded-sm border transition-all ${
                        isActive 
                          ? 'bg-black text-white border-black' 
                          : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {status}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
