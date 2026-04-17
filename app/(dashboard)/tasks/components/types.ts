export type SerializedTask = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  type: string | null;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  contract: {
    id: string;
    title: string;
    type: string;
  } | null;
};

export type Tab = {
  id: string;
  label: string;
  icon: React.ElementType;
  statuses: string[];
};

export type SortField = 'title' | 'dueDate';
export type SortDir = 'asc' | 'desc';
