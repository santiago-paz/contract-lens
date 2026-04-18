'use client';

import { Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useRef } from 'react';

export function AllExpiringSearch({
  defaultValue,
  urgency,
}: {
  defaultValue?: string;
  urgency: string;
}) {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const [inputValue, setInputValue] = useState(defaultValue || '');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearch = (term: string) => {
    setInputValue(term);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      if (term) {
        params.set('q', term);
      } else {
        params.delete('q');
      }
      if (urgency && urgency !== 'all') {
        params.set('urgency', urgency);
      }
      replace(`/all-expiring?${params.toString()}`);
    }, 300);
  };

  return (
    <div className="bg-white p-1 rounded-sm shadow-sm border border-gray-200">
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2.5 border-0 bg-transparent text-sm focus:ring-0 placeholder:text-gray-400 placeholder:uppercase placeholder:text-xs font-medium focus:outline-none"
          placeholder="Search expiring contracts..."
          value={inputValue}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
    </div>
  );
}
