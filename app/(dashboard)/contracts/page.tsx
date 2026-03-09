import { FileIcon, FileText, Plus } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ContractActions } from './ContractActions';
import { ContractFilters } from './ContractFilters';

function getStatusColor(status: string) {
  const s = status.toLowerCase();
  if (s === 'active' || s === 'completed' || s === 'approved') {
    return { text: 'text-black', dot: 'bg-[#CCFF00]', bg: 'bg-[#CCFF00]/20', border: 'border-[#CCFF00]' };
  }
  if (s === 'review' || s === 'pending' || s === 'in_progress' || s === 'draft') {
    return { text: 'text-black', dot: 'bg-yellow-400', bg: 'bg-yellow-50', border: 'border-yellow-200' };
  }
  if (s === 'open') {
    return { text: 'text-blue-700', dot: 'bg-blue-500', bg: 'bg-blue-50', border: 'border-blue-200' };
  }
  return { text: 'text-gray-600', dot: 'bg-gray-400', bg: 'bg-gray-50', border: 'border-gray-200' };
}

export default async function ContractsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const session = await getSession();

  if (!session || !session.id) {
    redirect('/login');
  }

  const resolvedSearchParams = await searchParams;
  const q = typeof resolvedSearchParams.q === 'string' ? resolvedSearchParams.q : undefined;
  const status = typeof resolvedSearchParams.status === 'string' ? resolvedSearchParams.status : undefined;

  const whereClause: any = {};

  if (q) {
    whereClause.title = {
      contains: q,
      mode: 'insensitive',
    };
  }

  if (status) {
    whereClause.status = {
      equals: status,
      mode: 'insensitive',
    };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.id as string },
    include: {
      contracts: {
        where: whereClause,
        orderBy: { updatedAt: 'desc' },
      },
    }
  });

  if (!user) {
    redirect('/login');
  }

  const contracts = user.contracts;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-black uppercase tracking-tight">Contracts</h1>
          <p className="text-gray-500 text-sm mt-1 uppercase font-medium">Manage all your contracts in one place</p>
        </div>
        <Link 
          href="/contract-creator" 
          className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white border border-black shadow-hard hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all active:bg-[#CCFF00] active:text-black group"
        >
          <Plus className="w-4 h-4 group-active:text-black" />
          <span className="text-xs font-bold font-mono uppercase">New Contract</span>
        </Link>
      </div>

      {/* Filters & Search */}
      <ContractFilters />

      {/* Contracts List */}
      <div className="bg-white rounded-sm shadow-sm border border-gray-200 overflow-hidden">
        {contracts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Contract Name</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Last Updated</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {contracts.map((contract) => {
                  const statusColor = getStatusColor(contract.status);
                  return (
                    <tr key={contract.id} className="hover:bg-gray-50 transition-colors group relative cursor-pointer">
                      <td className="px-6 py-4">
                        <Link href={`/contracts/${contract.id}`} className="flex items-center gap-3 after:absolute after:inset-0 after:content-['']">
                          <div className="p-2 bg-gray-100 rounded-sm text-gray-600 group-hover:bg-black group-hover:text-[#CCFF00] transition-colors">
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
                        <span className="text-[10px] font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded-sm uppercase border border-gray-200">
                          {contract.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase border ${statusColor.bg} ${statusColor.text} ${statusColor.border}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusColor.dot}`} />
                          {contract.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-gray-500 uppercase">
                        {new Date(contract.updatedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right relative z-10">
                        <ContractActions contractId={contract.id} />
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
              <FileIcon className="w-6 h-6 text-gray-300" />
            </div>
            {q || status ? (
              <>
                <h3 className="text-sm font-bold text-black uppercase mb-1">No results found</h3>
                <p className="text-gray-500 mb-6 max-w-xs text-xs">No contracts match your current filters.</p>
                <Link 
                  href="/contracts" 
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white text-black border border-gray-200 hover:border-black shadow-sm hover:shadow-md transition-all rounded-sm"
                >
                  <span className="text-xs font-bold font-mono uppercase">Clear Filters</span>
                </Link>
              </>
            ) : (
              <>
                <h3 className="text-sm font-bold text-black uppercase mb-1">No contracts yet</h3>
                <p className="text-gray-500 mb-6 max-w-xs text-xs">Create your first contract to get started with tracking and management.</p>
                <Link 
                  href="/contract-creator" 
                  className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white border border-black shadow-hard hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all active:bg-[#CCFF00] active:text-black group"
                >
                  <Plus className="w-4 h-4 group-active:text-black" />
                  <span className="text-xs font-bold font-mono uppercase">Create Contract</span>
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
