import { Bell, BellOff } from 'lucide-react';
import type { Tab } from './types';

export function EmptyState({ tab }: { tab: Tab }) {
  return (
    <div className="flex flex-col items-center justify-center p-16 text-center">
      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
        {tab.id === 'closed' ? (
          <BellOff className="w-6 h-6 text-gray-300" />
        ) : (
          <Bell className="w-6 h-6 text-gray-300" />
        )}
      </div>
      <h3 className="text-sm font-bold text-black uppercase mb-1">No {tab.label.toLowerCase()} alerts</h3>
      <p className="text-gray-500 max-w-xs text-xs">
        {tab.id === 'current' && 'There are no active alerts requiring attention.'}
        {tab.id === 'escalating' && 'No alerts have been escalated.'}
        {tab.id === 'closed' && 'No alerts have been resolved yet.'}
      </p>
    </div>
  );
}
