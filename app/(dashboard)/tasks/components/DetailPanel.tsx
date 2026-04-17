'use client';

import { updateTaskStatus } from '@/app/actions/tasks';
import { formatDate, getRelativeTime } from '@/lib/alert-utils';
import { cn } from '@/lib/utils';
import { CheckCircle2, Clock, FileText, X } from 'lucide-react';
import Link from 'next/link';
import { useTransition } from 'react';
import { getTaskStatusColor } from './constants';
import type { SerializedTask } from './types';

const STATUS_TRANSITIONS: Record<string, { label: string; next: string; icon: React.ElementType }[]> = {
  Open: [
    { label: 'Start Task', next: 'In Progress', icon: Clock },
    { label: 'Mark Complete', next: 'Completed', icon: CheckCircle2 },
  ],
  'In Progress': [
    { label: 'Mark Complete', next: 'Completed', icon: CheckCircle2 },
  ],
  Completed: [
    { label: 'Reopen Task', next: 'Open', icon: Clock },
  ],
};

export function DetailPanel({
  task,
  onClose,
}: {
  task: SerializedTask;
  onClose: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const statusColor = getTaskStatusColor(task.status);
  const transitions = STATUS_TRANSITIONS[task.status] || [];

  const handleStatusChange = (nextStatus: string) => {
    startTransition(async () => {
      await updateTaskStatus(task.id, nextStatus);
    });
  };

  return (
    <div className="w-80 shrink-0 border border-gray-200 border-l-0 bg-white overflow-y-auto animate-slide-in-right">
      {/* Panel Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="text-xs font-bold uppercase tracking-wider text-black">Task Details</h3>
        <button
          onClick={onClose}
          className="p-1 text-gray-400 hover:text-black transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Task Info */}
      <div className="p-4 space-y-5">
        {/* Title & Status */}
        <div>
          <h4 className="text-sm font-bold uppercase text-black leading-snug">{task.title}</h4>
          <div className="mt-2">
            <span
              className={cn(
                'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase border',
                statusColor.bg,
                statusColor.text,
                statusColor.border
              )}
            >
              <span className={cn('w-1.5 h-1.5 rounded-full', statusColor.dot)} />
              {task.status}
            </span>
          </div>
        </div>

        {/* Description */}
        {task.description && (
          <div className="space-y-2">
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-gray-300" />
              Description
            </div>
            <p className="text-xs text-gray-600 bg-gray-50 border border-gray-100 p-3 leading-relaxed">
              {task.description}
            </p>
          </div>
        )}

        {/* Type */}
        <div className="space-y-2">
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            Type
          </div>
          <span className="text-[10px] font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded-sm uppercase border border-gray-200">
            {task.type || 'General'}
          </span>
        </div>

        {/* Due Date */}
        {task.dueDate && (
          <div className="space-y-2">
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-gray-300" />
              Due Date
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-medium text-black">
                {formatDate(task.dueDate)}
              </span>
              <span className="text-[10px] text-gray-400 uppercase">
                {getRelativeTime(task.dueDate)}
              </span>
            </div>
            {new Date(task.dueDate) < new Date() && task.status !== 'Completed' && (
              <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-sm uppercase">
                Overdue
              </span>
            )}
          </div>
        )}

        {/* Contract Link */}
        {task.contract && (
          <div className="space-y-2">
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-gray-300" />
              Contract
            </div>
            <Link
              href={`/contracts/${task.contract.id}`}
              className="flex items-center gap-2 p-2 border border-gray-200 hover:border-black transition-colors group"
            >
              <FileText className="w-4 h-4 text-gray-400 group-hover:text-black" />
              <div className="min-w-0">
                <div className="text-xs font-bold text-black truncate">{task.contract.title}</div>
                <div className="text-[10px] text-gray-400 font-mono uppercase">
                  {task.contract.type}
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Dates */}
        <div className="space-y-2">
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            Timeline
          </div>
          <div className="text-[10px] text-gray-500 space-y-1 font-mono">
            <div>Created: {formatDate(task.createdAt)}</div>
            <div>Updated: {formatDate(task.updatedAt)}</div>
          </div>
        </div>

        {/* Status Actions */}
        {transitions.length > 0 && (
          <div className="pt-2 border-t border-gray-100 space-y-2">
            {transitions.map((t) => (
              <button
                key={t.next}
                onClick={() => handleStatusChange(t.next)}
                disabled={isPending}
                className={cn(
                  'w-full px-3 py-2 border text-xs font-bold font-mono uppercase transition-all disabled:opacity-50 flex items-center justify-center gap-2',
                  t.next === 'Completed'
                    ? 'bg-black text-white border-black shadow-hard-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none active:bg-[#CCFF00] active:text-black'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-black hover:text-black'
                )}
              >
                <t.icon className="w-3.5 h-3.5" />
                {isPending ? 'Updating...' : t.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
