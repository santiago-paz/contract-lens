export function getContractPhase(contract: { endDate: string | null; status: string; durationType: string | null }) {
  if (!contract.endDate) {
    return { label: 'Indefinite', variant: 'gray' as const };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date(contract.endDate);
  end.setHours(0, 0, 0, 0);
  const diffDays = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return { label: 'Expired', variant: 'red' as const };
  if (diffDays === 0) return { label: 'Ends today', variant: 'red' as const };
  if (diffDays <= 30) return { label: `Ends in ${diffDays}d`, variant: 'yellow' as const };
  return { label: 'Active', variant: 'green' as const };
}

export function getPhaseStyle(variant: string) {
  switch (variant) {
    case 'red':
      return 'text-red-700 bg-red-50 border-red-300';
    case 'yellow':
      return 'text-yellow-700 bg-yellow-50 border-yellow-300';
    case 'green':
      return 'text-black bg-[#CCFF00]/30 border-[#CCFF00]';
    default:
      return 'text-gray-500 bg-gray-50 border-gray-200';
  }
}
