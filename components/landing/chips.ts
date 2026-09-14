import type { Urgency } from './translations/types';

/** How soon a contract ends, as the product colours it: red inside a week, outlined red inside a month, quiet beyond. */
export const URGENCY_CHIP: Record<Urgency, string> = {
  week: 'bg-beck text-paper',
  month: 'border border-beck/60 text-beck',
  quarter: 'border border-rule text-muted',
};
