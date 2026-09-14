/** A run of specimen text; a `mark` is a highlighted passage that feeds one record field. */
export type Segment = string | { mark: number; text: string };

export type Paragraph = { heading?: string; segments: Segment[] };

export type SpecimenDocument = {
  fileName: string;
  pageNote: string;
  title: string;
  paragraphs: Paragraph[];
};

export type Urgency = 'week' | 'month' | 'quarter';

export type DeadlineRow = {
  title: string;
  partner: string;
  notice: string;
  ends: string;
  urgency: Urgency;
};

export type ContractTypeCard = { name: string; note?: string; fields: string[] };
