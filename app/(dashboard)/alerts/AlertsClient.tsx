'use client';

import { closeAlert, respondToAlert } from '@/app/actions/alerts';
import { RESPONSE_LABELS, STATUS_LABELS, formatDate, getEventLabel, getRelativeTime, getResponseStyle, getStatusColor } from '@/lib/alert-utils';
import { cn } from '@/lib/utils';
import type { SerializedAlert } from '@/types/alerts';
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  Bell,
  BellOff,
  CheckCircle2,
  FileText,
  RotateCcw,
  TrendingUp,
  X
} from 'lucide-react';
import Link from 'next/link';
import { useState, useTransition } from 'react';

export type { SerializedAlert } from '@/types/alerts';

type Tab = {
  id: string;
  label: string;
  icon: React.ElementType;
  statuses: string[];
};

type SortField = 'alarmDate' | 'deadline' | 'partner';
type SortDir = 'asc' | 'desc';

// ── Constants ────────────────────────────────────────────────────────────────

const TABS: Tab[] = [
  { id: 'current', label: 'Current', icon: AlertCircle, statuses: ['open_no_answer', 'open_with_answer'] },
  { id: 'escalating', label: 'Escalating', icon: TrendingUp, statuses: ['escalating'] },
  { id: 'closed', label: 'Closed', icon: CheckCircle2, statuses: ['closed'] },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function getContractPhase(contract: { endDate: string | null; status: string; durationType: string | null }) {
  if (!contract.endDate) {
    return { label: 'Indefinite', variant: 'gray' as const };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date(contract.endDate);
  end.setHours(0, 0, 0, 0);
  const diffDays = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return { label: 'Expired', variant: 'red' as const };
  if (diffDays === 0) return { label: 'Ends today', variant: 'red' as const };
  if (diffDays <= 30) return { label: `Ends in ${diffDays}d`, variant: 'yellow' as const };
  return { label: 'Active', variant: 'green' as const };
}

function getPhaseStyle(variant: string) {
  switch (variant) {
    case 'red':
      return 'text-red-700 bg-red-50 border-red-300';
    case 'yellow':
      return 'text-yellow-700 bg-yellow-50 border-yellow-300';
    case 'green':
      return 'text-black bg-[#CCFF00]/30 border-[#CCFF00]';
    default:
      return 'text-gray-500 bg-gray-50 border-gray-200';
  }
}

// ── Main Component ───────────────────────────────────────────────────────────

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

// ── Sub-components ───────────────────────────────────────────────────────────

function SortIndicator({
  field,
  currentField,
  dir,
}: {
  field: SortField;
  currentField: SortField;
  dir: SortDir;
}) {
  if (field !== currentField) {
    return (
      <span className="flex flex-col opacity-30">
        <ArrowUp className="w-3 h-3 -mb-1" />
        <ArrowDown className="w-3 h-3" />
      </span>
    );
  }
  return dir === 'asc' ? (
    <ArrowUp className="w-3 h-3 text-black" />
  ) : (
    <ArrowDown className="w-3 h-3 text-black" />
  );
}

function EmptyState({ tab }: { tab: Tab }) {
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

function DetailPanel({
  alert,
  onClose,
  onRespond,
  onCloseAlert,
}: {
  alert: SerializedAlert;
  onClose: () => void;
  onRespond: () => void;
  onCloseAlert: (id: string) => Promise<{ success: boolean; error?: string }>;
}) {
  const [isPending, startTransition] = useTransition();
  const statusColor = getStatusColor(alert.status);

  const handleClose = () => {
    startTransition(async () => {
      await onCloseAlert(alert.id);
    });
  };

  return (
    <div className="w-80 shrink-0 border border-gray-200 border-l-0 bg-white overflow-y-auto animate-slide-in-right">
      {/* Panel Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="text-xs font-bold uppercase tracking-wider text-black">Details</h3>
        <button
          onClick={onClose}
          className="p-1 text-gray-400 hover:text-black transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Alert Info */}
      <div className="p-4 space-y-5">
        {/* Type & Status */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-50 border border-gray-200 flex items-center justify-center">
            <Bell className="w-5 h-5 text-gray-500" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase text-black">Alarm</div>
            <span
              className={cn(
                'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase border mt-1',
                statusColor.bg,
                statusColor.text,
                statusColor.border
              )}
            >
              <span className={cn('w-1.5 h-1.5 rounded-full', statusColor.dot)} />
              {STATUS_LABELS[alert.status] || alert.status}
            </span>
          </div>
        </div>

        {/* Response Section */}
        <div className="space-y-2">
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            Response
          </div>
          {alert.response ? (
            <div className="space-y-2">
              <span
                className={cn(
                  'inline-flex items-center px-2 py-1 text-[10px] font-bold uppercase border rounded-sm',
                  getResponseStyle(alert.response.responseType)
                )}
              >
                {RESPONSE_LABELS[alert.response.responseType] || alert.response.responseType}
              </span>
              <div className="text-xs text-gray-500">
                {getRelativeTime(alert.response.createdAt)}
                <span className="mx-1.5">·</span>
                <span className="font-medium text-gray-700">
                  {alert.response.respondedBy.name || 'Unknown'}
                </span>
              </div>
              {alert.response.comment && (
                <p className="text-xs text-gray-600 bg-gray-50 border border-gray-100 p-2 mt-1">
                  {alert.response.comment}
                </p>
              )}
            </div>
          ) : (
            <button
              onClick={onRespond}
              className="w-full px-3 py-2 bg-black text-white border border-black text-xs font-bold font-mono uppercase shadow-hard-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all active:bg-[#CCFF00] active:text-black"
            >
              Respond to Alert
            </button>
          )}
        </div>

        {/* Contract Link */}
        <div className="space-y-2">
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            Contract
          </div>
          <Link
            href={`/contracts/${alert.contract.id}`}
            className="flex items-center gap-2 p-2 border border-gray-200 hover:border-black transition-colors group"
          >
            <FileText className="w-4 h-4 text-gray-400 group-hover:text-black" />
            <div className="min-w-0">
              <div className="text-xs font-bold text-black truncate">{alert.contract.title}</div>
              <div className="text-[10px] text-gray-400 font-mono">
                {alert.contract.contractNumber}
              </div>
            </div>
          </Link>
        </div>

        {/* Timeline */}
        {alert.events.length > 0 && (
          <div className="space-y-2">
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-gray-300" />
              Activity
            </div>
            <div className="space-y-0">
              {alert.events.map((event, i) => (
                <div key={event.id} className="flex gap-3 py-2">
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        'w-2 h-2 rounded-full mt-1.5',
                        i === 0 ? 'bg-black' : 'bg-gray-300'
                      )}
                    />
                    {i < alert.events.length - 1 && (
                      <div className="w-px flex-1 bg-gray-200 mt-1" />
                    )}
                  </div>
                  <div className="pb-2">
                    <div className="text-xs font-medium text-black">
                      {getEventLabel(event.eventType)}
                    </div>
                    <div className="text-[10px] text-gray-400 mt-0.5">
                      {getRelativeTime(event.createdAt)}
                      {event.user.name && (
                        <>
                          <span className="mx-1">·</span>
                          {event.user.name}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        {alert.status !== 'closed' && (
          <div className="pt-2 border-t border-gray-100">
            <button
              onClick={handleClose}
              disabled={isPending}
              className="w-full px-3 py-2 bg-white text-gray-600 border border-gray-200 hover:border-black hover:text-black text-xs font-bold font-mono uppercase transition-all disabled:opacity-50"
            >
              {isPending ? 'Closing...' : 'Close Alert'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ResponseDialog({
  alert,
  onClose,
}: {
  alert: SerializedAlert;
  onClose: () => void;
}) {
  const [responseType, setResponseType] = useState('');
  const [comment, setComment] = useState('');
  const [isPending, startTransition] = useTransition();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSubmit = () => {
    if (!responseType) return;
    startTransition(async () => {
      const result = await respondToAlert(alert.id, responseType, comment || undefined);
      if (result.success) {
        onClose();
      } else {
        alert && window.alert(result.error || 'Failed to respond');
      }
    });
  };

  const options = [
    { value: 'continue', label: 'Continue contract' },
    { value: 'terminate', label: 'Terminate contract' },
    { value: 'question', label: 'Question' },
  ];

  const selectedOption = options.find((o) => o.value === responseType);

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
          <h2 className="text-sm font-bold uppercase tracking-wider text-black">Respond to Alert</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-black transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Response Type Dropdown */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              Response <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={cn(
                  'w-full px-3 py-2.5 border text-left text-xs font-medium transition-colors flex items-center justify-between',
                  dropdownOpen
                    ? 'border-black'
                    : 'border-gray-200 hover:border-gray-300',
                  !responseType && 'text-gray-400'
                )}
              >
                {selectedOption ? selectedOption.label : 'Select...'}
                <ArrowDown className="w-3.5 h-3.5 text-gray-400" />
              </button>
              {dropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-black shadow-hard-sm z-10 animate-fade-in-fast">
                  {options.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setResponseType(opt.value);
                        setDropdownOpen(false);
                      }}
                      className={cn(
                        'w-full px-3 py-2.5 text-left text-xs font-medium hover:bg-gray-50 transition-colors',
                        responseType === opt.value && 'bg-[#CCFF00]/20 font-bold'
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              Comment <span className="text-gray-300">(optional)</span>
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              className="w-full px-3 py-2.5 border border-gray-200 focus:border-black text-xs outline-none resize-none transition-colors"
              placeholder="Add a note..."
            />
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
            disabled={!responseType || isPending}
            className="px-4 py-2 bg-black text-white border border-black text-xs font-bold font-mono uppercase shadow-hard-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all active:bg-[#CCFF00] active:text-black disabled:opacity-50 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-hard-sm"
          >
            {isPending ? 'Submitting...' : 'Submit Response'}
          </button>
        </div>
      </div>
    </div>
  );
}
