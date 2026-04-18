'use client';

import { cn } from '@/lib/utils';
import {
  Bell,
  CheckSquare,
  ChevronLeft,
  Clock,
  Files,
  FileText,
  LayoutDashboard,
  Menu,
  Settings,
  User,
  Users,
  LogOut,
  Terminal
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logout } from '@/app/actions/auth';

type NavItem = {
  label: string;
  href: string;
  icon: React.ElementType;
  comingSoon?: boolean;
};

type NavSection = {
  title: string;
  items: NavItem[];
};

const NAV_SECTIONS: NavSection[] = [
  {
    title: 'PERSONAL',
    items: [
      { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
      { label: 'Contracts', href: '/contracts', icon: FileText },
      { label: 'Alerts', href: '/alerts', icon: Bell, comingSoon: false },
      { label: 'Tasks', href: '/tasks', icon: CheckSquare, comingSoon: false },
      { label: 'Created by me', href: '/created-by-me', icon: User, comingSoon: false },
      { label: 'Expiring Contracts', href: '/expiring-contracts', icon: Clock, comingSoon: false },
    ],
  },
  {
    title: 'ORGANISATION',
    items: [
      { label: 'All Contracts', href: '/all-contracts', icon: Files, comingSoon: false },
      { label: 'Recently created', href: '/recently-created', icon: FileText, comingSoon: false },
      { label: 'All Expiring Contracts', href: '/all-expiring', icon: Clock, comingSoon: false },
      { label: 'Partners', href: '/partners', icon: Users, comingSoon: false },
      { label: 'Settings', href: '/settings/members', icon: Settings, comingSoon: false },
    ],
  },
];

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

export function Sidebar({ isCollapsed, toggleSidebar }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "h-screen bg-white border-r border-black flex flex-col transition-all duration-300 relative z-20",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo Area */}
      <div className={cn(
        "h-16 flex items-center px-6 border-b border-black bg-black text-white",
        isCollapsed ? "justify-center px-0" : "justify-between"
      )}>
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#CCFF00] border border-white flex items-center justify-center">
               <span className="text-black font-mono font-bold text-xs leading-none">S</span>
            </div>
            <span className="text-sm font-mono font-bold uppercase tracking-wider text-white">Blackletter</span>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="p-1 hover:bg-[#CCFF00] hover:text-black rounded-none border border-transparent hover:border-white transition-colors text-white"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <Menu className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6 space-y-8 bg-white">
        {NAV_SECTIONS.map((section, idx) => (
          <div key={idx} className="px-4">
            {!isCollapsed && (
              <h3 className="text-[10px] font-bold font-mono text-black uppercase tracking-widest mb-4 px-2 border-b border-black pb-1 inline-block">
                {section.title}
              </h3>
            )}
            <div className="space-y-2">
              {section.items.map((item) => {
                const isActive = !item.comingSoon && (pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href)));

                if (item.comingSoon) {
                  return (
                    <div
                      key={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 font-mono border border-transparent text-gray-300 cursor-default select-none",
                        isCollapsed && "justify-center px-2"
                      )}
                      title={isCollapsed ? `${item.label} — Coming Soon` : undefined}
                    >
                      <item.icon className="w-4 h-4 shrink-0 text-gray-300" />
                      {!isCollapsed && (
                        <span className="truncate text-xs uppercase tracking-wide">{item.label}</span>
                      )}
                      {!isCollapsed && (
                        <span className="ml-auto text-[9px] font-mono uppercase tracking-wider text-gray-400 border border-gray-200 px-1.5 py-0.5 leading-none whitespace-nowrap">
                          Soon
                        </span>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 transition-all group border border-transparent",
                      isActive
                        ? "bg-[#CCFF00] text-black font-bold font-mono border-black shadow-hard-sm"
                        : "text-gray-500 font-mono hover:text-black hover:border-black hover:translate-x-1",
                      isCollapsed && "justify-center px-2"
                    )}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <item.icon className={cn(
                      "w-4 h-4 shrink-0",
                      isActive ? "text-black" : "text-gray-400 group-hover:text-black"
                    )} />
                    {!isCollapsed && (
                      <span className="truncate text-xs uppercase tracking-wide">{item.label}</span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

        {/* Admin section — only visible when NEXT_PUBLIC_DEBUG is enabled */}
        {process.env.NEXT_PUBLIC_DEBUG === 'true' && (
          <div className="px-4">
            {!isCollapsed && (
              <h3 className="text-[10px] font-bold font-mono text-black uppercase tracking-widest mb-4 px-2 border-b border-dashed border-red-400 pb-1 inline-block">
                Admin
              </h3>
            )}
            <div className="space-y-2">
              {(() => {
                const isActive = pathname.startsWith('/admin/playground');
                return (
                  <Link
                    href="/admin/playground"
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 transition-all group border border-transparent",
                      isActive
                        ? "bg-[#CCFF00] text-black font-bold font-mono border-black shadow-hard-sm"
                        : "text-gray-500 font-mono hover:text-black hover:border-black hover:translate-x-1",
                      isCollapsed && "justify-center px-2"
                    )}
                    title={isCollapsed ? "Playground" : undefined}
                  >
                    <Terminal className={cn(
                      "w-4 h-4 shrink-0",
                      isActive ? "text-black" : "text-gray-400 group-hover:text-black"
                    )} />
                    {!isCollapsed && (
                      <span className="truncate text-xs uppercase tracking-wide">Playground</span>
                    )}
                  </Link>
                );
              })()}
            </div>
          </div>
        )}
      </div>

      {/* Footer/User */}
      <div className="p-4 border-t border-black bg-gray-50">
        <button
          onClick={() => logout()}
          className={cn(
            "flex w-full items-center gap-3 px-3 py-2.5 border border-black shadow-hard-sm bg-white hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all text-black group",
            isCollapsed && "justify-center px-2"
          )}
          title={isCollapsed ? "Sign Out" : undefined}
        >
          <LogOut className="w-4 h-4 shrink-0 text-black" />
          {!isCollapsed && <span className="truncate text-xs font-bold font-mono uppercase">Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
