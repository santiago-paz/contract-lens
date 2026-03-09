'use client';

import { useEffect, useState } from 'react';
import { Bell, Loader2, X } from 'lucide-react';
import Link from 'next/link';
import { getUserNotifications } from '@/app/actions/alerts';
import { cn } from '@/lib/utils';

type Notification = {
  id: string;
  alarmDate: string;
  deadline: string | null;
  status: string;
  contractId: string;
  contractTitle: string;
  contractNumber: string;
  createdByName: string | null;
  createdAt: string;
};

export function NotificationsDropdown({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      getUserNotifications().then((result) => {
        if (result.success && result.notifications) {
          setNotifications(result.notifications);
        }
        setLoading(false);
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-black shadow-hard z-50 animate-fade-in-fast">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <h3 className="text-xs font-bold uppercase tracking-wider text-black">Notifications</h3>
        <button onClick={onClose} className="p-1 text-gray-400 hover:text-black transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
          </div>
        ) : notifications.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {notifications.map((notification) => (
              <Link
                key={notification.id}
                href={`/contracts/${notification.contractId}`}
                className="block p-4 hover:bg-gray-50 transition-colors group"
                onClick={onClose}
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gray-50 border border-gray-200 flex items-center justify-center shrink-0 group-hover:border-black transition-colors">
                    <Bell className="w-4 h-4 text-gray-500 group-hover:text-black" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-black truncate">
                      {notification.contractTitle}
                    </div>
                    <div className="text-[10px] text-gray-500 font-mono mt-0.5">
                      {notification.contractNumber}
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <span className={cn(
                        "text-[10px] font-bold uppercase px-1.5 py-0.5 border rounded-sm",
                        getStatusStyle(notification.status)
                      )}>
                        {getStatusLabel(notification.status)}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {new Date(notification.alarmDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center px-4">
            <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center mb-3 border border-gray-100">
              <Bell className="w-4 h-4 text-gray-300" />
            </div>
            <p className="text-xs font-medium text-gray-500">No new notifications</p>
          </div>
        )}
      </div>
      
      <div className="p-2 border-t border-gray-200 bg-gray-50">
        <Link 
            href="/alerts" 
            className="block w-full py-2 text-center text-[10px] font-bold uppercase text-black hover:underline"
            onClick={onClose}
        >
            View all alerts
        </Link>
      </div>
    </div>
  );
}

function getStatusStyle(status: string) {
  switch (status) {
    case 'open_no_answer':
      return 'text-yellow-800 bg-yellow-50 border-yellow-300';
    case 'open_with_answer':
      return 'text-green-800 bg-green-50 border-green-300';
    case 'escalating':
      return 'text-red-800 bg-red-50 border-red-300';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case 'open_no_answer': return 'Open';
    case 'open_with_answer': return 'Answered';
    case 'escalating': return 'Escalating';
    case 'closed': return 'Closed';
    default: return status;
  }
}
