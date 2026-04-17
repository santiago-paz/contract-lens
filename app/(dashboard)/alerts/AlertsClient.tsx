'use client';

import { closeAlert } from '@/app/actions/alerts';
import { STATUS_LABELS, formatDate, getStatusColor } from '@/lib/alert-utils';
import { cn } from '@/lib/utils';
import type { SerializedAlert } from '@/types/alerts';
import { FileText, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { DetailPanel } from './components/DetailPanel';
import { EmptyState } from './components/EmptyState';
import { ResponseDialog } from './components/ResponseDialog';
import { SortIndicator } from './components/SortIndicator';
import { TABS } from './components/constants';
import { getContractPhase, getPhaseStyle } from './components/contract-phase';
import type { SortDir, SortField } from './components/types';

export type { SerializedAlert } from '@/types/alerts';

export function AlertsClient({ alerts }: { alerts: SerializedAlert[] }) {
  const [activeTab, setActiveTab] = useState('current');
  const [sortField, setSortField] = useState<SortField>('alarmDate');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [selectedAlert, setSelectedAlert] = useState<SerializedAlert | null>(null);
  const [showResponseDialog, setShowResponseDialog] = useState(false);
  const [respondingAlert, setRespondingAlert] = useState<SerializedAlert | null>(null);

  const currentTab = TABS.find((t) => t.id === activeTab)!;
  const filtered = alerts.filter((a) => currentTab.statuses.includes(a.status));

  const sorted = [...filtered].sort((a, b) => {
    let aVal: string | number = '';
    let bVal: string | number = '';

    switch (sortField) {
      case 'alarmDate':
        aVal = new Date(a.alarmDate).getTime();
        bVal = new Date(b.alarmDate).getTime();
        break;
      case 'deadline':
        aVal = a.deadline ? new Date(a.deadline).getTime() : 0;
        bVal = b.deadline ? new Date(b.deadline).getTime() : 0;
        break;
      case 'partner':
        aVal = a.contract.contractPartner || '';
        bVal = b.contract.contractPartner || '';
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
      setSortDir('desc');
    }
  };

  const resetView = () => {
    setActiveTab('current');
    setSortField('alarmDate');
    setSortDir('desc');
    setSelectedAlert(null);
  };

  const openResponse = (alert: SerializedAlert) => {
    setRespondingAlert(alert);
    setShowResponseDialog(true);
  };

  const tabCounts = TABS.map((tab) => ({
    ...tab,
    count: alerts.filter((a) => tab.statuses.includes(a.status)).length,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-black uppercase tracking-tight">Alerts</h1>
          <p className="text-gray-500 text-sm mt-1 uppercase font-medium">
            Monitor deadlines and respond to contract alarms
          </p>
        </div>
        <button
          onClick={resetView}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-600 border border-gray-200 hover:border-black hover:text-black transition-all text-xs font-bold font-mono uppercase"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset view
        </button>
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
                  setSelectedAlert(null);
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
            selectedAlert ? 'flex-1 min-w-0' : 'w-full'
          )}
        >
          {sorted.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-5 py-3">
                      <button
                        onClick={() => toggleSort('alarmDate')}
                        className="flex items-center gap-1 text-[10px] font-bold text-gray-500 uppercase tracking-wider hover:text-black transition-colors"
                      >
                        Alarm Date
                        <SortIndicator field="alarmDate" currentField={sortField} dir={sortDir} />
                      </button>
                    </th>
                    <th className="px-5 py-3">
                      <button
                        onClick={() => toggleSort('partner')}
                        className="flex items-center gap-1 text-[10px] font-bold text-gray-500 uppercase tracking-wider hover:text-black transition-colors"
                      >
                        Partner
                        <SortIndicator field="partner" currentField={sortField} dir={sortDir} />
                      </button>
                    </th>
                    <th className="px-5 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                      Contract
                    </th>
                    <th className="px-5 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-5 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                      Contract Phase
                    </th>
                    <th className="px-5 py-3">
                      <button
                        onClick={() => toggleSort('deadline')}
                        className="flex items-center gap-1 text-[10px] font-bold text-gray-500 uppercase tracking-wider hover:text-black transition-colors"
                      >
                        Deadline
                        <SortIndicator field="deadline" currentField={sortField} dir={sortDir} />
                      </button>
                    </th>
                    <th className="px-5 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {sorted.map((alert) => {
                    const phase = getContractPhase(alert.contract);
                    const statusColor = getStatusColor(alert.status);
                    const isSelected = selectedAlert?.id === alert.id;

                    return (
                      <tr
                        key={alert.id}
                        onClick={() => setSelectedAlert(isSelected ? null : alert)}
                        className={cn(
                          'hover:bg-gray-50 transition-colors cursor-pointer group border-l-2 border-transparent',
                          isSelected && 'bg-gray-50 border-l-black'
                        )}
                      >
                        <td className="px-5 py-4 text-xs font-medium text-black font-mono">
                          {formatDate(alert.alarmDate)}
                        </td>
                        <td className="px-5 py-4 text-xs font-medium text-gray-700">
                          {alert.contract.contractPartner || '—'}
                        </td>
                        <td className="px-5 py-4">
                          <Link
                            href={`/contracts/${alert.contract.id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-2 text-xs font-bold text-black hover:text-blue-600 transition-colors"
                          >
                            <FileText className="w-3.5 h-3.5 text-gray-400 group-hover:text-black" />
                            <span className="truncate max-w-[200px]">{alert.contract.title}</span>
                          </Link>
                        </td>
                        <td className="px-5 py-4 text-xs text-gray-500">
                          {alert.contract.durationType || '—'}
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={cn(
                              'inline-flex items-center px-2 py-0.5 text-[10px] font-bold uppercase border rounded-sm',
                              getPhaseStyle(phase.variant)
                            )}
                          >
                            {phase.label}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-medium text-black">
                              {alert.deadline ? formatDate(alert.deadline) : '—'}
                            </span>
                            {alert.deadlineLabel && (
                              <span className="text-[9px] font-bold uppercase text-gray-400 border border-gray-200 px-1.5 py-0.5 leading-none">
                                {alert.deadlineLabel}
                              </span>
                            )}
                          </div>
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
                            {STATUS_LABELS[alert.status] || alert.status}
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
        {selectedAlert && (
          <DetailPanel
            alert={selectedAlert}
            onClose={() => setSelectedAlert(null)}
            onRespond={() => openResponse(selectedAlert)}
            onCloseAlert={closeAlert}
          />
        )}
      </div>

      {/* Response Dialog */}
      {showResponseDialog && respondingAlert && (
        <ResponseDialog
          alert={respondingAlert}
          onClose={() => {
            setShowResponseDialog(false);
            setRespondingAlert(null);
          }}
        />
      )}
    </div>
  );
}
