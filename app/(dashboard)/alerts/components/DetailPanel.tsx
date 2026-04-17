'use client';

import { RESPONSE_LABELS, STATUS_LABELS, getEventLabel, getRelativeTime, getResponseStyle, getStatusColor } from '@/lib/alert-utils';
import { cn } from '@/lib/utils';
import type { SerializedAlert } from '@/types/alerts';
import { Bell, FileText, X } from 'lucide-react';
import Link from 'next/link';
import { useTransition } from 'react';

export function DetailPanel({
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
