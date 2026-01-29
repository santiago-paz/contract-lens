import { FileIcon, FileText, Edit, Plus, Search, Filter } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

function getStatusColor(status: string) {
  const s = status.toLowerCase();
  if (s === 'active' || s === 'completed' || s === 'approved') {
    return { text: 'text-emerald-600', dot: 'bg-emerald-500', bg: 'bg-emerald-50' };
  }
  if (s === 'review' || s === 'pending' || s === 'in_progress' || s === 'draft') {
    return { text: 'text-amber-600', dot: 'bg-amber-500', bg: 'bg-amber-50' };
  }
  if (s === 'open') {
    return { text: 'text-blue-600', dot: 'bg-blue-500', bg: 'bg-blue-50' };
  }
  return { text: 'text-gray-600', dot: 'bg-gray-500', bg: 'bg-gray-50' };
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
          <h1 className="text-3xl font-bold text-gray-800">Contracts</h1>
          <p className="text-gray-500 mt-2">Manage all your contracts in one place</p>
        </div>
        <Link 
          href="/contract-creator" 
          className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
        >
          <Plus className="w-5 h-5" />
          New Contract
        </Link>
      </div>

      {/* Filters & Search (Visual only for now) */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
            placeholder="Search contracts..."
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium border border-gray-200 w-full sm:w-auto justify-center">
          <Filter className="w-4 h-4" />
          Filters
        </button>
      </div>

      {/* Contracts List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {contracts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contract Name</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Updated</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {contracts.map((contract) => {
                  const statusColor = getStatusColor(contract.status);
                  return (
                    <tr key={contract.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{contract.title}</div>
                            <div className="text-xs text-gray-500">ID: {contract.contractNumber}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-md">
                          {contract.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusColor.bg} ${statusColor.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusColor.dot}`} />
                          {contract.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(contract.updatedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit Contract">
                          <Edit className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <FileIcon className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No contracts yet</h3>
            <p className="text-gray-500 mb-6 max-w-sm">Create your first contract to get started with tracking and management.</p>
            <Link 
              href="/contract-creator" 
              className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
            >
              <Plus className="w-5 h-5" />
              Create Contract
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
