export type Urgency = 'week' | 'month' | 'quarter';

export type DeadlineRow = {
  title: string;
  partner: string;
  notice: string;
  ends: string;
  /** Days left, so the filters on the sample list can cut it the way the product does. */
  days: number;
  urgency: Urgency;
};

/** One line of a checklist. A null value is a field the contract does not cover, and the product leaves it empty. */
export type ChecklistField = { label: string; value: string | null };

export type ContractTypeCard = {
  name: string;
  /** The short name on the tab. */
  tab: string;
  fields: ChecklistField[];
};

export type Role = 'viewer' | 'member' | 'manager' | 'admin' | 'owner';

/** Roles from least to most access. Each one can do what the roles before it can. */
export const ROLE_ORDER: readonly Role[] = ['viewer', 'member', 'manager', 'admin', 'owner'];

/** A capability, and the first role that has it. */
export type Capability = { label: string; from: Role };

export type Language = 'en' | 'de';
