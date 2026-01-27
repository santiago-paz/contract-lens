export const CONTRACT_TYPES = [
  'General Terms and Conditions',
  'Order / Commission',
  'Operating Agreement',
  'Loan Agreement',
  'Service Agreement',
  'Partnership Agreement',
  'Purchase Agreement',
  'Cooperation Agreement',
  'Leasing Agreement',
  'Supply Agreement',
  'License Agreement',
  'Rental Agreement',
  'Project Agreement',
  'Framework Agreement',
  'Sponsoring Agreement',
  'Standard Contract',
  'Letter of Commitment',
  'Insurance Contract',
  'Non-Disclosure Agreement',
  'Maintenance Contract',
  'Work Contract',
  'Takeover Agreement'
] as const;

export type ContractType = typeof CONTRACT_TYPES[number];
