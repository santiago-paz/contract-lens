import { AlertCircle, CheckCircle2, TrendingUp } from 'lucide-react';
import type { Tab } from './types';

export const TABS: Tab[] = [
  { id: 'current', label: 'Current', icon: AlertCircle, statuses: ['open_no_answer', 'open_with_answer'] },
  { id: 'escalating', label: 'Escalating', icon: TrendingUp, statuses: ['escalating'] },
  { id: 'closed', label: 'Closed', icon: CheckCircle2, statuses: ['closed'] },
];
