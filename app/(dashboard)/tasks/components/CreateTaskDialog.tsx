'use client';

import { createTask } from '@/app/actions/tasks';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { useState, useTransition } from 'react';

interface CreateTaskDialogProps {
  onClose: () => void;
  contractId?: string;
  contractTitle?: string;
  defaultType?: string;
}

export function CreateTaskDialog({ onClose, contractId, contractTitle, defaultType }: CreateTaskDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState(defaultType || '');
  const [dueDate, setDueDate] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    if (!title.trim()) return;
    startTransition(async () => {
      const result = await createTask({
        title,
        description: description || undefined,
        type: type || undefined,
        dueDate: dueDate || undefined,
        contractId,
      });
      if (result.success) {
        onClose();
      } else {
        window.alert(result.error || 'Failed to create task');
      }
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white border border-black shadow-hard w-full max-w-md animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <h2 className="text-sm font-bold uppercase tracking-wider text-black">New Task</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-black transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Contract context */}
          {contractTitle && (
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider bg-gray-50 border border-gray-200 px-3 py-2 rounded-sm">
              Contract: <span className="text-black">{contractTitle}</span>
            </div>
          )}

          {/* Title */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 focus:border-black text-xs outline-none transition-colors"
              placeholder="Task title..."
              autoFocus
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              Description <span className="text-gray-300">(optional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2.5 border border-gray-200 focus:border-black text-xs outline-none resize-none transition-colors"
              placeholder="Add details..."
            />
          </div>

          {/* Type & Due Date row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                Type <span className="text-gray-300">(optional)</span>
              </label>
              <input
                type="text"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 focus:border-black text-xs outline-none transition-colors"
                placeholder="e.g. NDA"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                Due Date <span className="text-gray-300">(optional)</span>
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className={cn(
                  'w-full px-3 py-2.5 border border-gray-200 focus:border-black text-xs outline-none transition-colors',
                  !dueDate && 'text-gray-400'
                )}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold font-mono uppercase text-gray-500 hover:text-black transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!title.trim() || isPending}
            className="px-4 py-2 bg-black text-white border border-black text-xs font-bold font-mono uppercase shadow-hard-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all active:bg-[#CCFF00] active:text-black disabled:opacity-50 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-hard-sm"
          >
            {isPending ? 'Creating...' : 'Create Task'}
          </button>
        </div>
      </div>
    </div>
  );
}
