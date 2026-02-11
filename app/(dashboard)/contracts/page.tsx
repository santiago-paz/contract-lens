import { FileIcon, FileText, Plus, Search, Filter } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ContractActions } from './ContractActions';

function getStatusColor(status: string) {
  const s = status.toLowerCase();
  if (s === 'active' || s === 'completed' || s === 'approved') {
    return { text: 'text-black', dot: 'bg-[#00D4FF]', bg: 'bg-[#00D4FF]/20', border: 'border-[#00D4FF]' };
  }
  if (s === 'review' || s === 'pending' || s === 'in_progress' || s === 'draft') {
    return { text: 'text-black', dot: 'bg-yellow-400', bg: 'bg-yellow-50', border: 'border-yellow-200' };
  }
  if (s === 'open') {
    return { text: 'text-blue-700', dot: 'bg-blue-500', bg: 'bg-blue-50', border: 'border-blue-200' };
  }
  return { text: 'text-gray-600', dot: 'bg-gray-400', bg: 'bg-gray-50', border: 'border-gray-200' };
}

export default async function ContractsPage() {
  const session = await getSession();

  if (!session || !session.id) {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.id as string },
    include: {
      contracts: {
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
          className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white border border-black shadow-hard hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all active:bg-[#00D4FF] active:text-black group"
        >
          <Plus className="w-4 h-4 group-active:text-black" />
          <span className="text-xs font-bold font-mono uppercase">New Contract</span>
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-1 rounded-sm shadow-sm border border-gray-200 flex flex-col sm:flex-row gap-2 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2.5 border-0 bg-transparent text-sm focus:ring-0 placeholder:text-gray-400 placeholder:uppercase placeholder:text-xs font-medium"
            placeholder="Search contracts..."
          />
        </div>
        <div className="h-6 w-px bg-gray-200 hidden sm:block"></div>
        <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-black hover:bg-gray-50 transition-colors text-xs font-bold uppercase w-full sm:w-auto justify-center rounded-sm">
          <Filter className="w-3 h-3" />
          Filters
        </button>
      </div>

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
                          <div className="p-2 bg-gray-100 rounded-sm text-gray-600 group-hover:bg-black group-hover:text-[#00D4FF] transition-colors">
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
            <h3 className="text-sm font-bold text-black uppercase mb-1">No contracts yet</h3>
            <p className="text-gray-500 mb-6 max-w-xs text-xs">Create your first contract to get started with tracking and management.</p>
            <Link 
              href="/contract-creator" 
              className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white border border-black shadow-hard hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all active:bg-[#00D4FF] active:text-black group"
            >
              <Plus className="w-4 h-4 group-active:text-black" />
              <span className="text-xs font-bold font-mono uppercase">Create Contract</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
