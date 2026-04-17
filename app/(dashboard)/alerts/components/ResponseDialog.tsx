'use client';

import { respondToAlert } from '@/app/actions/alerts';
import { cn } from '@/lib/utils';
import type { SerializedAlert } from '@/types/alerts';
import { ArrowDown, X } from 'lucide-react';
import { useState, useTransition } from 'react';

const RESPONSE_OPTIONS = [
  { value: 'continue', label: 'Continue contract' },
  { value: 'terminate', label: 'Terminate contract' },
  { value: 'question', label: 'Question' },
];

export function ResponseDialog({
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
        window.alert(result.error || 'Failed to respond');
      }
    });
  };

  const selectedOption = RESPONSE_OPTIONS.find((o) => o.value === responseType);

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
                  {RESPONSE_OPTIONS.map((opt) => (
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
