import { CheckCircle2, Circle, Clock } from 'lucide-react';
import type { Tab } from './types';

export const TABS: Tab[] = [
  { id: 'open', label: 'Open', icon: Circle, statuses: ['Open'] },
  { id: 'in_progress', label: 'In Progress', icon: Clock, statuses: ['In Progress'] },
  { id: 'completed', label: 'Completed', icon: CheckCircle2, statuses: ['Completed'] },
];

export function getTaskStatusColor(status: string) {
  const s = status.toLowerCase();
  if (s === 'open') {
    return { dot: 'bg-blue-500', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' };
  }
  if (s === 'in progress') {
    return { dot: 'bg-yellow-400', bg: 'bg-yellow-50', text: 'text-black', border: 'border-yellow-200' };
  }
  if (s === 'completed') {
    return { dot: 'bg-[#CCFF00]', bg: 'bg-[#CCFF00]/20', text: 'text-black', border: 'border-[#CCFF00]' };
  }
  return { dot: 'bg-gray-400', bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200' };
}
