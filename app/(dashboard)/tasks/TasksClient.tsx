'use client';

import { formatDate } from '@/lib/alert-utils';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp, FileText, Plus, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { CreateTaskDialog } from './components/CreateTaskDialog';
import { DetailPanel } from './components/DetailPanel';
import { EmptyState } from './components/EmptyState';
import { TABS, getTaskStatusColor } from './components/constants';
import type { SerializedTask, SortDir, SortField } from './components/types';

function SortIndicator({ field, currentField, dir }: { field: SortField; currentField: SortField; dir: SortDir }) {
  if (field !== currentField) return <ChevronDown className="w-3 h-3 text-gray-300" />;
  return dir === 'asc'
    ? <ChevronUp className="w-3 h-3 text-black" />
    : <ChevronDown className="w-3 h-3 text-black" />;
}

function isOverdue(dueDate: string | null, status: string) {
  if (!dueDate || status === 'Completed') return false;
  return new Date(dueDate) < new Date();
}

export function TasksClient({ tasks }: { tasks: SerializedTask[] }) {
  const [activeTab, setActiveTab] = useState('open');
  const [sortField, setSortField] = useState<SortField>('dueDate');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [selectedTask, setSelectedTask] = useState<SerializedTask | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const currentTab = TABS.find((t) => t.id === activeTab)!;
  const filtered = tasks.filter((t) => currentTab.statuses.includes(t.status));

  const sorted = [...filtered].sort((a, b) => {
    let aVal: string | number = '';
    let bVal: string | number = '';

    switch (sortField) {
      case 'dueDate':
        aVal = a.dueDate ? new Date(a.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
        bVal = b.dueDate ? new Date(b.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
        break;
      case 'title':
        aVal = a.title.toLowerCase();
        bVal = b.title.toLowerCase();
        break;
    }

    if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const resetView = () => {
    setActiveTab('open');
    setSortField('dueDate');
    setSortDir('asc');
    setSelectedTask(null);
  };

  const tabCounts = TABS.map((tab) => ({
    ...tab,
    count: tasks.filter((t) => tab.statuses.includes(t.status)).length,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-black uppercase tracking-tight">Tasks</h1>
          <p className="text-gray-500 text-sm mt-1 uppercase font-medium">
            Track and manage your pending work items
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={resetView}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-600 border border-gray-200 hover:border-black hover:text-black transition-all text-xs font-bold font-mono uppercase"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset view
          </button>
          <button
            onClick={() => setShowCreateDialog(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white border border-black shadow-hard hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all active:bg-[#CCFF00] active:text-black group text-xs font-bold font-mono uppercase"
          >
            <Plus className="w-4 h-4 group-active:text-black" />
            New Task
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-0">
          {tabCounts.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSelectedTask(null);
                }}
                className={cn(
                  'flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all',
                  isActive
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-400 hover:text-black hover:border-gray-300'
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {tab.count > 0 && (
                  <span
                    className={cn(
                      'text-[10px] font-bold px-1.5 py-0.5 leading-none border',
                      isActive
                        ? 'bg-black text-white border-black'
                        : 'bg-gray-100 text-gray-500 border-gray-200'
                    )}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content: Table + Detail Panel */}
      <div className="flex gap-0">
        {/* Table */}
        <div
          className={cn(
            'bg-white rounded-sm shadow-sm border border-gray-200 overflow-hidden transition-all duration-300',
            selectedTask ? 'flex-1 min-w-0' : 'w-full'
          )}
        >
          {sorted.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-5 py-3">
                      <button
                        onClick={() => toggleSort('title')}
                        className="flex items-center gap-1 text-[10px] font-bold text-gray-500 uppercase tracking-wider hover:text-black transition-colors"
                      >
                        Task
                        <SortIndicator field="title" currentField={sortField} dir={sortDir} />
                      </button>
                    </th>
                    <th className="px-5 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-5 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                      Contract
                    </th>
                    <th className="px-5 py-3">
                      <button
                        onClick={() => toggleSort('dueDate')}
                        className="flex items-center gap-1 text-[10px] font-bold text-gray-500 uppercase tracking-wider hover:text-black transition-colors"
                      >
                        Due Date
                        <SortIndicator field="dueDate" currentField={sortField} dir={sortDir} />
                      </button>
                    </th>
                    <th className="px-5 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {sorted.map((task) => {
                    const statusColor = getTaskStatusColor(task.status);
                    const isSelected = selectedTask?.id === task.id;
                    const overdue = isOverdue(task.dueDate, task.status);

                    return (
                      <tr
                        key={task.id}
                        onClick={() => setSelectedTask(isSelected ? null : task)}
                        className={cn(
                          'hover:bg-gray-50 transition-colors cursor-pointer group border-l-2 border-transparent',
                          isSelected && 'bg-gray-50 border-l-black'
                        )}
                      >
                        <td className="px-5 py-4">
                          <div>
                            <div className="font-bold text-black text-xs uppercase leading-snug">
                              {task.title}
                            </div>
                            {task.description && (
                              <div className="text-[10px] text-gray-400 mt-0.5 truncate max-w-[250px]">
                                {task.description}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-[10px] font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded-sm uppercase border border-gray-200">
                            {task.type || 'GEN'}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          {task.contract ? (
                            <Link
                              href={`/contracts/${task.contract.id}`}
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-2 text-xs font-bold text-black hover:text-blue-600 transition-colors"
                            >
                              <FileText className="w-3.5 h-3.5 text-gray-400 group-hover:text-black" />
                              <span className="truncate max-w-[180px]">{task.contract.title}</span>
                            </Link>
                          ) : (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          {task.dueDate ? (
                            <span
                              className={cn(
                                'text-xs font-mono font-medium',
                                overdue ? 'text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-sm' : 'text-black'
                              )}
                            >
                              {formatDate(task.dueDate)}
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </td>
                        <td className="px-5 py-4">
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
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState tab={currentTab} />
          )}
        </div>

        {/* Detail Panel */}
        {selectedTask && (
          <DetailPanel
            task={selectedTask}
            onClose={() => setSelectedTask(null)}
          />
        )}
      </div>

      {/* Create Task Dialog */}
      {showCreateDialog && (
        <CreateTaskDialog onClose={() => setShowCreateDialog(false)} />
      )}
    </div>
  );
}
