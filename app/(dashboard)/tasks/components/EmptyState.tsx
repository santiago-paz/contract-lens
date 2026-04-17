import { CheckCircle2, CircleDashed } from 'lucide-react';
import type { Tab } from './types';

export function EmptyState({ tab }: { tab: Tab }) {
  return (
    <div className="flex flex-col items-center justify-center p-16 text-center">
      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
        {tab.id === 'completed' ? (
          <CheckCircle2 className="w-6 h-6 text-gray-300" />
        ) : (
          <CircleDashed className="w-6 h-6 text-gray-300" />
        )}
      </div>
      <h3 className="text-sm font-bold text-black uppercase mb-1">No {tab.label.toLowerCase()} tasks</h3>
      <p className="text-gray-500 max-w-xs text-xs">
        {tab.id === 'open' && 'There are no open tasks requiring attention.'}
        {tab.id === 'in_progress' && 'No tasks are currently in progress.'}
        {tab.id === 'completed' && 'No tasks have been completed yet.'}
      </p>
    </div>
  );
}
