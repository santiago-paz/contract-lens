import { ArrowDown, ArrowUp } from 'lucide-react';
import type { SortDir, SortField } from './types';

export function SortIndicator({
  field,
  currentField,
  dir,
}: {
  field: SortField;
  currentField: SortField;
  dir: SortDir;
}) {
  if (field !== currentField) {
    return (
      <span className="flex flex-col opacity-30">
        <ArrowUp className="w-3 h-3 -mb-1" />
        <ArrowDown className="w-3 h-3" />
      </span>
    );
  }
  return dir === 'asc' ? (
    <ArrowUp className="w-3 h-3 text-black" />
  ) : (
    <ArrowDown className="w-3 h-3 text-black" />
  );
}
