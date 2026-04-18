import { AlertTriangle, Calendar, Clock, FileText, ShieldAlert } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { getSessionWithOrg } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

type Urgency = 'expired' | 'this-week' | 'this-month' | '90-days' | 'all';

function getDaysRemaining(endDate: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);
  return Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function getUrgencyStyle(days: number) {
  if (days < 0) return { text: 'text-red-700', bg: 'bg-red-50', border: 'border-red-300', dot: 'bg-red-500', label: 'Expired' };
  if (days === 0) return { text: 'text-red-700', bg: 'bg-red-50', border: 'border-red-300', dot: 'bg-red-500', label: 'Ends today' };
  if (days <= 7) return { text: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200', dot: 'bg-red-400', label: `${days}d left` };
  if (days <= 30) return { text: 'text-yellow-700', bg: 'bg-yellow-50', border: 'border-yellow-300', dot: 'bg-yellow-400', label: `${days}d left` };
  return { text: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200', dot: 'bg-gray-400', label: `${days}d left` };
}

export default async function ExpiringContractsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const session = await getSessionWithOrg();
  if (!session) redirect('/login');

  const resolvedSearchParams = await searchParams;
  const q = typeof resolvedSearchParams.q === 'string' ? resolvedSearchParams.q : undefined;
  const urgency = (typeof resolvedSearchParams.urgency === 'string' ? resolvedSearchParams.urgency : 'all') as Urgency;

  const contracts = await prisma.contract.findMany({
    where: {
      userId: session.userId,
      organizationId: session.orgId,
      endDate: { not: null },
      ...(q ? { title: { contains: q, mode: 'insensitive' as const } } : {}),
    },
    orderBy: { endDate: 'asc' },
    select: {
      id: true,
      title: true,
      contractNumber: true,
      type: true,
      status: true,
      endDate: true,
      startDate: true,
      renewalDate: true,
      autoRenewal: true,
      contractPartner: true,
      terminationNoticePeriod: true,
    },
  });

  const withDays = contracts.map((c) => ({
    ...c,
    daysRemaining: getDaysRemaining(c.endDate!),
  }));

  // Counts for summary cards
  const expired = withDays.filter((c) => c.daysRemaining < 0);
  const thisWeek = withDays.filter((c) => c.daysRemaining >= 0 && c.daysRemaining <= 7);
  const thisMonth = withDays.filter((c) => c.daysRemaining >= 0 && c.daysRemaining <= 30);
  const next90 = withDays.filter((c) => c.daysRemaining >= 0 && c.daysRemaining <= 90);

  // Filter based on urgency param
  let filtered = withDays;
  if (urgency === 'expired') filtered = expired;
  else if (urgency === 'this-week') filtered = thisWeek;
  else if (urgency === 'this-month') filtered = thisMonth;
  else if (urgency === '90-days') filtered = next90;
  else filtered = withDays.filter((c) => c.daysRemaining <= 90); // default: show up to 90 days + expired

  const summaryCards = [
    { key: 'expired' as const, label: 'Expired', count: expired.length, icon: ShieldAlert, color: 'border-red-400 bg-red-50', textColor: 'text-red-700', iconColor: 'text-red-500' },
    { key: 'this-week' as const, label: 'This Week', count: thisWeek.length, icon: AlertTriangle, color: 'border-yellow-400 bg-yellow-50', textColor: 'text-yellow-700', iconColor: 'text-yellow-500' },
    { key: 'this-month' as const, label: '30 Days', count: thisMonth.length, icon: Clock, color: 'border-yellow-300 bg-yellow-50/50', textColor: 'text-yellow-600', iconColor: 'text-yellow-400' },
    { key: '90-days' as const, label: '90 Days', count: next90.length, icon: Calendar, color: 'border-gray-300 bg-gray-50', textColor: 'text-gray-600', iconColor: 'text-gray-400' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-black uppercase tracking-tight">Expiring Contracts</h1>
        <p className="text-gray-500 text-sm mt-1 uppercase font-medium">Monitor your contracts approaching expiration</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card) => (
          <Link
            key={card.key}
            href={`/expiring-contracts?urgency=${card.key}${q ? `&q=${q}` : ''}`}
            className={`relative p-4 border-2 ${card.color} transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none ${urgency === card.key ? 'shadow-hard-sm border-black' : 'shadow-hard-sm'}`}
          >
            {urgency === card.key && (
              <div className="absolute top-0 right-0 w-2 h-2 bg-[#CCFF00] border border-black" />
            )}
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-2xl font-black font-mono ${card.textColor}`}>{card.count}</p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mt-1">{card.label}</p>
              </div>
              <card.icon className={`w-5 h-5 ${card.iconColor}`} />
            </div>
          </Link>
        ))}
      </div>

      {/* Search */}
      <ExpiringContractsSearch defaultValue={q} urgency={urgency} />

      {/* Table */}
      <div className="bg-white rounded-sm shadow-sm border border-gray-200 overflow-hidden">
        {filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Contract</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Partner</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">End Date</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Time Left</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Auto-Renewal</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Notice Period</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((contract) => {
                  const urg = getUrgencyStyle(contract.daysRemaining);
                  return (
                    <tr key={contract.id} className="hover:bg-gray-50 transition-colors group relative cursor-pointer">
                      <td className="px-6 py-4">
                        <Link href={`/contracts/${contract.id}`} className="flex items-center gap-3 after:absolute after:inset-0 after:content-['']">
                          <div className={`p-2 rounded-sm transition-colors ${contract.daysRemaining <= 7 ? 'bg-red-100 text-red-600 group-hover:bg-red-600 group-hover:text-white' : 'bg-gray-100 text-gray-600 group-hover:bg-black group-hover:text-[#CCFF00]'}`}>
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-bold text-black text-xs uppercase leading-snug">{contract.title}</div>
                            {!contract.contractNumber.startsWith('CNT-') && (
                              <div className="text-[10px] text-gray-400 font-mono mt-0.5">REF: {contract.contractNumber}</div>
                            )}
                          </div>
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-gray-600 font-mono">
                          {contract.contractPartner || '—'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded-sm uppercase border border-gray-200">
                          {contract.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-gray-500 font-mono">
                        {new Date(contract.endDate!).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase border ${urg.bg} ${urg.text} ${urg.border}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${urg.dot}`} />
                          {urg.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {contract.autoRenewal ? (
                          <span className="text-[10px] font-bold text-black bg-[#CCFF00]/30 px-2 py-0.5 rounded-sm uppercase border border-[#CCFF00]">Yes</span>
                        ) : (
                          <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-sm uppercase border border-gray-200">No</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-gray-500 font-mono">
                          {contract.terminationNoticePeriod || '—'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-16 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
              <Clock className="w-6 h-6 text-gray-300" />
            </div>
            {q || urgency !== 'all' ? (
              <>
                <h3 className="text-sm font-bold text-black uppercase mb-1">No contracts found</h3>
                <p className="text-gray-500 mb-6 max-w-xs text-xs">No contracts match your current filters.</p>
                <Link
                  href="/expiring-contracts"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white text-black border border-gray-200 hover:border-black shadow-sm hover:shadow-md transition-all rounded-sm"
                >
                  <span className="text-xs font-bold font-mono uppercase">Clear Filters</span>
                </Link>
              </>
            ) : (
              <>
                <h3 className="text-sm font-bold text-black uppercase mb-1">No expiring contracts</h3>
                <p className="text-gray-500 max-w-xs text-xs">None of your contracts have an end date set, or none are expiring within 90 days.</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Client component for search with debounce
import { ExpiringContractsSearch } from './ExpiringContractsSearch';
