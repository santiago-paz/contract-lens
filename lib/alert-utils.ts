export const STATUS_LABELS: Record<string, string> = {
  open_no_answer: 'Open',
  open_with_answer: 'Answered',
  escalating: 'Escalating',
  closed: 'Closed',
};

export const RESPONSE_LABELS: Record<string, string> = {
  continue: 'Continue contract',
  terminate: 'Terminate contract',
  question: 'Question',
};

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function getRelativeTime(iso: string) {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return formatDate(iso);
}

export function getStatusColor(status: string) {
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

export function getResponseStyle(type: string) {
  switch (type) {
    case 'terminate':
      return 'text-red-700 bg-red-50 border-red-300';
    case 'continue':
      return 'text-green-700 bg-green-50 border-green-300';
    default:
      return 'text-blue-700 bg-blue-50 border-blue-200';
  }
}

export function getEventLabel(eventType: string) {
  switch (eventType) {
    case 'alarmed': return 'Alarm triggered';
    case 'responded': return 'Response submitted';
    case 'escalated': return 'Escalated';
    case 'closed': return 'Closed';
    default: return eventType;
  }
}
