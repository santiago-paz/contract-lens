export type NodeType = 'title' | 'intro' | 'clause' | 'subclause' | 'item' | 'subitem' | 'final_clause';

export interface ContractNodeData {
  id: string;
  type: NodeType;
  contentLeft: string;
  contentRight: string;
  children: ContractNodeData[];
  isExpanded?: boolean;
}

export const NODE_TYPES: { type: NodeType; label: string }[] = [
  { type: 'title', label: 'Título del Contrato' },
  { type: 'intro', label: 'Introducción / Partes' },
  { type: 'clause', label: 'Cláusula Principal' },
  { type: 'subclause', label: 'Subcláusula' },
  { type: 'item', label: 'Inciso' },
  { type: 'subitem', label: 'Sub-inciso' },
  { type: 'final_clause', label: 'Cláusula Final' },
];

export const ALLOWED_CHILDREN: Record<NodeType, NodeType[]> = {
  title: [],
  intro: [],
  clause: ['subclause'],
  subclause: ['item'],
  item: ['subitem'],
  subitem: [],
  final_clause: [],
};

// Root level allowed types
export const ROOT_TYPES: NodeType[] = ['title', 'intro', 'clause', 'final_clause'];
