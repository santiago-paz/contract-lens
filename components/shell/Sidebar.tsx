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
  User,
  Users,
  LogOut
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logout } from '@/app/actions/auth';

type NavItem = {
  label: string;
  href: string;
  icon: React.ElementType;
};

type NavSection = {
  title: string;
  items: NavItem[];
};

const NAV_SECTIONS: NavSection[] = [
  {
    title: 'PERSONAL',
    items: [
      { label: 'Overview', href: '/', icon: LayoutDashboard },
      { label: 'Contracts', href: '/contracts', icon: FileText },
      { label: 'Alerts', href: '/alerts', icon: Bell },
      { label: 'Tasks', href: '/tasks', icon: CheckSquare },
      { label: 'Created by me', href: '/created-by-me', icon: User },
      { label: 'Expiring Contracts', href: '/expiring-contracts', icon: Clock },
    ],
  },
  {
    title: 'ORGANISATION',
    items: [
      { label: 'All Contracts', href: '/all-contracts', icon: Files },
      { label: 'Recently created', href: '/recently-created', icon: FileText },
      { label: 'All Expiring Contracts', href: '/all-expiring', icon: Clock },
      { label: 'Partners', href: '/partners', icon: Users },
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
        "h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-300 relative z-20",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo Area */}
      <div className={cn(
        "h-16 flex items-center px-6 border-b border-gray-100",
        isCollapsed ? "justify-center px-0" : "justify-between"
      )}>
        {!isCollapsed && (
          <span className="text-xl font-bold text-blue-600 truncate">Split Berlin</span>
        )}
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <Menu className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6 space-y-8">
        {NAV_SECTIONS.map((section, idx) => (
          <div key={idx} className="px-4">
            {!isCollapsed && (
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-2">
                {section.title}
              </h3>
            )}
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group",
                      isActive
                        ? "bg-blue-50 text-blue-600 font-medium"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                      isCollapsed && "justify-center px-2"
                    )}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <item.icon className={cn(
                      "w-5 h-5 shrink-0",
                      isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"
                    )} />
                    {!isCollapsed && (
                      <span className="truncate">{item.label}</span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer/User (Optional, if not in TopBar) */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={() => logout()}
          className={cn(
            "flex w-full items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-gray-600 hover:bg-gray-50 hover:text-red-600 group",
            isCollapsed && "justify-center px-2"
          )}
          title={isCollapsed ? "Cerrar Sesión" : undefined}
        >
          <LogOut className="w-5 h-5 shrink-0 text-gray-400 group-hover:text-red-600" />
          {!isCollapsed && <span className="truncate">Cerrar Sesión</span>}
        </button>
      </div>
    </aside>
  );
}
