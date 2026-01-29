'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/shell/Sidebar';
import { TopNav } from '@/components/shell/TopNav';

interface DashboardShellProps {
  children: React.ReactNode;
  user?: { name: string | null; email: string } | null;
}

export function DashboardShell({ children, user }: DashboardShellProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans text-gray-900">
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={() => setIsCollapsed(!isCollapsed)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden transition-all duration-300">
        <TopNav user={user} />
        <main className="flex-1 overflow-y-auto p-6 md:p-8 scroll-smooth">
          {children}
        </main>
      </div>
    </div>
  );
}
