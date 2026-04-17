export type Tab = {
  id: string;
  label: string;
  icon: React.ElementType;
  statuses: string[];
};

export type SortField = 'alarmDate' | 'deadline' | 'partner';
export type SortDir = 'asc' | 'desc';
