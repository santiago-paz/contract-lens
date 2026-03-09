'use client';

import { useState, useTransition } from 'react';
import {
  Bell,
  BellPlus,
  X,
  ArrowDown,
  ArrowUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { createAlert, respondToAlert, closeAlert } from '@/app/actions/alerts';

// ── Types ────────────────────────────────────────────────────────────────────

export type ContractAlert = {
  id: string;
  alarmDate: string;
  deadline: string | null;
  deadlineLabel: string | null;
  status: string;
  note: string | null;
  createdAt: string;
  contractId: string;
  createdById: string;
  response: {
    id: string;
    responseType: string;
    comment: string | null;
    createdAt: string;
    respondedBy: {
      id: string;
      name: string | null;
    };
  } | null;
  events: Array<{
    id: string;
    eventType: string;
    description: string | null;
    createdAt: string;
    user: {
      id: string;
      name: string | null;
    };
  }>;
};

// ── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_LABELS: Record<string, string> = {
  open_no_answer: 'Open',
  open_with_answer: 'Answered',
  escalating: 'Escalating',
  closed: 'Closed',
};

const RESPONSE_LABELS: Record<string, string> = {
  continue: 'Continue contract',
  terminate: 'Terminate contract',
  question: 'Question',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function getRelativeTime(iso: string) {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return formatDate(iso);
}

function getStatusColor(status: string) {
  switch (status) {
    case 'open_no_answer':
      return { text: 'text-yellow-800', bg: 'bg-yellow-50', border: 'border-yellow-300', dot: 'bg-yellow-400' };
    case 'open_with_answer':
      return { text: 'text-green-800', bg: 'bg-green-50', border: 'border-green-300', dot: 'bg-green-500' };
    case 'escalating':
      return { text: 'text-red-800', bg: 'bg-red-50', border: 'border-red-300', dot: 'bg-red-500' };
    case 'closed':
      return { text: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200', dot: 'bg-gray-400' };
    default:
      return { text: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200', dot: 'bg-gray-400' };
  }
}

function getResponseStyle(type: string) {
  switch (type) {
    case 'terminate':
      return 'text-red-700 bg-red-50 border-red-300';
    case 'continue':
      return 'text-green-700 bg-green-50 border-green-300';
    default:
      return 'text-blue-700 bg-blue-50 border-blue-200';
  }
}

function getEventLabel(eventType: string) {
  switch (eventType) {
    case 'alarmed': return 'Alarm triggered';
    case 'responded': return 'Response submitted';
    case 'escalated': return 'Escalated';
    case 'closed': return 'Closed';
    default: return eventType;
  }
}

// ── Main Component ───────────────────────────────────────────────────────────

export function ContractAlerts({
  contractId,
  alerts,
}: {
  contractId: string;
  alerts: ContractAlert[];
}) {
  const [selectedAlert, setSelectedAlert] = useState<ContractAlert | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showResponseDialog, setShowResponseDialog] = useState(false);
  const [respondingAlert, setRespondingAlert] = useState<ContractAlert | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const sorted = [...alerts].sort((a, b) => {
    const aTime = new Date(a.alarmDate).getTime();
    const bTime = new Date(b.alarmDate).getTime();
    return sortDir === 'asc' ? aTime - bTime : bTime - aTime;
  });

  const openResponse = (alert: ContractAlert) => {
    setRespondingAlert(alert);
    setShowResponseDialog(true);
  };

  return (
    <div className="flex h-full overflow-hidden">
      {/* Table area */}
      <div className={cn('flex-1 min-w-0 flex flex-col', selectedAlert && 'border-r border-gray-200')}>
        {/* Toolbar */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-white shrink-0">
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
            {alerts.length} alert{alerts.length !== 1 ? 's' : ''}
          </div>
          <button
            onClick={() => setShowCreateDialog(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black text-white border border-black text-[10px] font-bold font-mono uppercase shadow-hard-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all active:bg-[#CCFF00] active:text-black"
          >
            <BellPlus className="w-3 h-3" />
            New Alert
          </button>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-y-auto">
          {sorted.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-3">
                    <button
                      onClick={() => setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))}
                      className="flex items-center gap-1 text-[10px] font-bold text-gray-500 uppercase tracking-wider hover:text-black transition-colors"
                    >
                      Alarm Date
                      {sortDir === 'asc' ? (
                        <ArrowUp className="w-3 h-3 text-black" />
                      ) : (
                        <ArrowDown className="w-3 h-3 text-black" />
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    Deadline
                  </th>
                  <th className="px-6 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    Responder
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sorted.map((alert) => {
                  const statusColor = getStatusColor(alert.status);
                  const isSelected = selectedAlert?.id === alert.id;
                  return (
                    <tr
                      key={alert.id}
                      onClick={() => setSelectedAlert(isSelected ? null : alert)}
                      className={cn(
                        'hover:bg-gray-50 transition-colors cursor-pointer',
                        isSelected && 'bg-gray-50'
                      )}
                    >
                      <td className="px-6 py-4 text-xs font-mono font-medium text-black">
                        {formatDate(alert.alarmDate)}
                      </td>
                      <td className="px-6 py-4">
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
                      <td className="px-6 py-4">
                        {alert.deadline ? (
                          <span className="text-xs font-mono text-black">{formatDate(alert.deadline)}</span>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-700">
                        {alert.response?.respondedBy.name || '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
                <Bell className="w-5 h-5 text-gray-300" />
              </div>
              <h3 className="text-xs font-bold text-black uppercase mb-1">No alerts yet</h3>
              <p className="text-gray-500 text-[10px] max-w-[200px] mb-4">
                Create an alert to track important deadlines for this contract.
              </p>
              <button
                onClick={() => setShowCreateDialog(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black text-white border border-black text-[10px] font-bold font-mono uppercase shadow-hard-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all active:bg-[#CCFF00] active:text-black"
              >
                <BellPlus className="w-3 h-3" />
                New Alert
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Detail Panel */}
      {selectedAlert && (
        <AlertDetailPanel
          alert={selectedAlert}
          onClose={() => setSelectedAlert(null)}
          onRespond={() => openResponse(selectedAlert)}
        />
      )}

      {/* Create Alert Dialog */}
      {showCreateDialog && (
        <CreateAlertDialog
          contractId={contractId}
          onClose={() => setShowCreateDialog(false)}
        />
      )}

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

// ── Detail Panel ─────────────────────────────────────────────────────────────

function AlertDetailPanel({
  alert,
  onClose,
  onRespond,
}: {
  alert: ContractAlert;
  onClose: () => void;
  onRespond: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const statusColor = getStatusColor(alert.status);

  const handleClose = () => {
    startTransition(async () => {
      await closeAlert(alert.id);
    });
  };

  return (
    <div className="w-72 shrink-0 bg-white overflow-y-auto animate-fade-in-fast">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <h3 className="text-xs font-bold uppercase tracking-wider text-black">Details</h3>
        <button onClick={onClose} className="p-1 text-gray-400 hover:text-black transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

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

        {/* Response */}
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
              <div className="text-[10px] text-gray-500">
                {getRelativeTime(alert.response.createdAt)}
                <span className="mx-1.5">·</span>
                <span className="font-medium text-gray-700">{alert.response.respondedBy.name || 'Unknown'}</span>
              </div>
              {alert.response.comment && (
                <p className="text-[10px] text-gray-600 bg-gray-50 border border-gray-100 p-2">{alert.response.comment}</p>
              )}
            </div>
          ) : (
            <button
              onClick={onRespond}
              className="w-full px-3 py-2 bg-black text-white border border-black text-[10px] font-bold font-mono uppercase shadow-hard-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all active:bg-[#CCFF00] active:text-black"
            >
              Respond to Alert
            </button>
          )}
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
                    <div className={cn('w-2 h-2 rounded-full mt-1.5', i === 0 ? 'bg-black' : 'bg-gray-300')} />
                    {i < alert.events.length - 1 && <div className="w-px flex-1 bg-gray-200 mt-1" />}
                  </div>
                  <div className="pb-1">
                    <div className="text-[10px] font-medium text-black">{getEventLabel(event.eventType)}</div>
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

        {/* Close action */}
        {alert.status !== 'closed' && (
          <div className="pt-2 border-t border-gray-100">
            <button
              onClick={handleClose}
              disabled={isPending}
              className="w-full px-3 py-2 bg-white text-gray-600 border border-gray-200 hover:border-black hover:text-black text-[10px] font-bold font-mono uppercase transition-all disabled:opacity-50"
            >
              {isPending ? 'Closing...' : 'Close Alert'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Create Alert Dialog ──────────────────────────────────────────────────────

function CreateAlertDialog({
  contractId,
  onClose,
}: {
  contractId: string;
  onClose: () => void;
}) {
  const [deadline, setDeadline] = useState('');
  const [deadlineLabel, setDeadlineLabel] = useState('');
  const [note, setNote] = useState('');
  const [isPending, startTransition] = useTransition();
  const [labelDropdownOpen, setLabelDropdownOpen] = useState(false);

  const labels = ['End date', 'Renewal', 'Notice period', 'Custom'];

  const handleCreate = () => {
    startTransition(async () => {
      const result = await createAlert(contractId, {
        deadline: deadline || undefined,
        deadlineLabel: deadlineLabel || undefined,
        note: note || undefined,
      });
      if (result.success) {
        onClose();
      } else {
        window.alert(result.error || 'Failed to create alert');
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white border border-black shadow-hard w-full max-w-md animate-fade-in" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <h2 className="text-sm font-bold uppercase tracking-wider text-black">Create Alert</h2>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-black transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Deadline */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Deadline</label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 focus:border-black text-xs outline-none transition-colors font-mono"
            />
          </div>

          {/* Deadline Label */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Deadline Type</label>
            <div className="relative">
              <button
                onClick={() => setLabelDropdownOpen(!labelDropdownOpen)}
                className={cn(
                  'w-full px-3 py-2.5 border text-left text-xs font-medium transition-colors flex items-center justify-between',
                  labelDropdownOpen ? 'border-black' : 'border-gray-200 hover:border-gray-300',
                  !deadlineLabel && 'text-gray-400'
                )}
              >
                {deadlineLabel || 'Select...'}
                <ArrowDown className="w-3.5 h-3.5 text-gray-400" />
              </button>
              {labelDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-black shadow-hard-sm z-10 animate-fade-in-fast">
                  {labels.map((label) => (
                    <button
                      key={label}
                      onClick={() => {
                        setDeadlineLabel(label);
                        setLabelDropdownOpen(false);
                      }}
                      className={cn(
                        'w-full px-3 py-2.5 text-left text-xs font-medium hover:bg-gray-50 transition-colors',
                        deadlineLabel === label && 'bg-[#CCFF00]/20 font-bold'
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Note */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              Note <span className="text-gray-300">(optional)</span>
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
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
            onClick={handleCreate}
            disabled={isPending}
            className="px-4 py-2 bg-black text-white border border-black text-xs font-bold font-mono uppercase shadow-hard-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all active:bg-[#CCFF00] active:text-black disabled:opacity-50 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-hard-sm"
          >
            {isPending ? 'Creating...' : 'Create Alert'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Response Dialog ──────────────────────────────────────────────────────────

function ResponseDialog({
  alert,
  onClose,
}: {
  alert: ContractAlert;
  onClose: () => void;
}) {
  const [responseType, setResponseType] = useState('');
  const [comment, setComment] = useState('');
  const [isPending, startTransition] = useTransition();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const options = [
    { value: 'continue', label: 'Continue contract' },
    { value: 'terminate', label: 'Terminate contract' },
    { value: 'question', label: 'Question' },
  ];

  const selectedOption = options.find((o) => o.value === responseType);

  const handleSubmit = () => {
    if (!responseType) return;
    startTransition(async () => {
      const result = await respondToAlert(alert.id, responseType, comment || undefined);
      if (result.success) {
        onClose();
      } else {
        window.alert(result.error || 'Failed to respond');
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white border border-black shadow-hard w-full max-w-md animate-fade-in" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <h2 className="text-sm font-bold uppercase tracking-wider text-black">Respond to Alert</h2>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-black transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Response Type */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              Response <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={cn(
                  'w-full px-3 py-2.5 border text-left text-xs font-medium transition-colors flex items-center justify-between',
                  dropdownOpen ? 'border-black' : 'border-gray-200 hover:border-gray-300',
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

          {/* Feedback */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Feedback</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              className="w-full px-3 py-2.5 border border-gray-200 focus:border-black text-xs outline-none resize-none transition-colors"
              placeholder="Add feedback..."
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
            {isPending ? 'Submitting...' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}
