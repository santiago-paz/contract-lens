'use client';

import { useState, useTransition, useEffect } from 'react';
import { CheckCircle2, Clock, ListPlus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createTask, updateTaskStatus } from '@/app/actions/tasks';
import { formatDate, getRelativeTime } from '@/lib/alert-utils';
import { CreateTaskDialog } from '@/app/(dashboard)/tasks/components/CreateTaskDialog';

export type ContractTask = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  type: string | null;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
};

export function ContractTasks({
  contractId,
  contractTitle,
  contractType,
  tasks,
}: {
  contractId: string;
  contractTitle: string;
  contractType: string;
  tasks: ContractTask[];
}) {
  const [localTasks, setLocalTasks] = useState<ContractTask[]>(tasks);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  function getStatusColor(status: string) {
    const s = status.toLowerCase();
    if (s === 'open') return { dot: 'bg-blue-500', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' };
    if (s === 'in progress') return { dot: 'bg-yellow-400', bg: 'bg-yellow-50', text: 'text-black', border: 'border-yellow-200' };
    if (s === 'completed') return { dot: 'bg-[#CCFF00]', bg: 'bg-[#CCFF00]/20', text: 'text-black', border: 'border-[#CCFF00]' };
    return { dot: 'bg-gray-400', bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200' };
  }

  const handleStatusChange = (taskId: string, nextStatus: string) => {
    startTransition(async () => {
      const result = await updateTaskStatus(taskId, nextStatus);
      if (result.success) {
        setLocalTasks((prev) =>
          prev.map((t) => (t.id === taskId ? { ...t, status: nextStatus } : t))
        );
      }
    });
  };

  const openTasks = localTasks.filter((t) => t.status !== 'Completed');
  const completedTasks = localTasks.filter((t) => t.status === 'Completed');

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold uppercase rounded-sm">Tasks</div>
          <span className="text-[10px] font-bold text-gray-400 uppercase">
            {openTasks.length} open · {completedTasks.length} completed
          </span>
        </div>
        <button
          onClick={() => setShowCreateDialog(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black text-white text-[10px] font-bold font-mono uppercase shadow-hard-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all active:bg-[#CCFF00] active:text-black"
        >
          <Plus className="w-3 h-3" />
          New Task
        </button>
      </div>

      {/* Task List */}
      <div className="p-6 space-y-3">
        {localTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
              <ListPlus className="w-6 h-6 text-gray-300" />
            </div>
            <h3 className="text-sm font-bold text-black uppercase mb-1">No tasks yet</h3>
            <p className="text-gray-500 max-w-xs text-xs mb-4">
              Create tasks to track work items for this contract.
            </p>
            <button
              onClick={() => setShowCreateDialog(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white border border-black text-xs font-bold font-mono uppercase shadow-hard-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all active:bg-[#CCFF00] active:text-black"
            >
              <Plus className="w-3.5 h-3.5" />
              Create Task
            </button>
          </div>
        ) : (
          <>
            {/* Open / In Progress tasks */}
            {openTasks.map((task) => {
              const statusColor = getStatusColor(task.status);
              const overdue = task.dueDate && new Date(task.dueDate) < new Date();

              return (
                <div
                  key={task.id}
                  className="bg-white border border-gray-200 shadow-sm hover:border-black transition-colors rounded-sm"
                >
                  <div className="px-4 py-3">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h4 className="font-bold text-black text-xs uppercase leading-snug flex-1">
                        {task.title}
                      </h4>
                      <span
                        className={cn(
                          'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase border shrink-0',
                          statusColor.bg,
                          statusColor.text,
                          statusColor.border
                        )}
                      >
                        <span className={cn('w-1.5 h-1.5 rounded-full', statusColor.dot)} />
                        {task.status}
                      </span>
                    </div>

                    {task.description && (
                      <p className="text-[10px] text-gray-500 mb-2 leading-relaxed">{task.description}</p>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <div className="flex items-center gap-3">
                        {task.dueDate && (
                          <span
                            className={cn(
                              'text-[10px] font-mono font-medium',
                              overdue ? 'text-red-600' : 'text-gray-500'
                            )}
                          >
                            Due {formatDate(task.dueDate)}
                          </span>
                        )}
                        {task.type && (
                          <span className="text-[10px] text-gray-400 uppercase">{task.type}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        {task.status === 'Open' && (
                          <button
                            onClick={() => handleStatusChange(task.id, 'In Progress')}
                            disabled={isPending}
                            className="p-1 text-gray-400 hover:text-yellow-600 transition-colors disabled:opacity-50"
                            title="Start task"
                          >
                            <Clock className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleStatusChange(task.id, 'Completed')}
                          disabled={isPending}
                          className="p-1 text-gray-400 hover:text-green-600 transition-colors disabled:opacity-50"
                          title="Complete task"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Completed tasks */}
            {completedTasks.length > 0 && (
              <div className="pt-3 mt-3 border-t border-gray-200">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">
                  Completed ({completedTasks.length})
                </div>
                {completedTasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-gray-50 border border-gray-100 px-4 py-3 mb-2 rounded-sm opacity-60"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-gray-500 text-xs uppercase line-through">
                        {task.title}
                      </h4>
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase border bg-[#CCFF00]/20 text-black border-[#CCFF00]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#CCFF00]" />
                        Completed
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Create Task Dialog */}
      {showCreateDialog && (
        <CreateTaskDialog
          onClose={() => setShowCreateDialog(false)}
          contractId={contractId}
          contractTitle={contractTitle}
          defaultType={contractType}
        />
      )}
    </div>
  );
}
