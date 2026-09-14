export type Urgency = 'week' | 'month' | 'quarter';

export type DeadlineRow = {
  title: string;
  partner: string;
  notice: string;
  ends: string;
  urgency: Urgency;
};

export type ContractTypeCard = { name: string; note?: string; fields: string[] };
