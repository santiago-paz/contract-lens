import { FileIcon, FileText } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

function getTimeAgo(date: Date) {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  
  return date.toLocaleDateString();
}

function getStatusColor(status: string) {
  const s = status.toLowerCase();
  if (s === 'active' || s === 'completed' || s === 'approved') {
    return { text: 'text-emerald-600', dot: 'bg-emerald-500' };
  }
  if (s === 'review' || s === 'pending' || s === 'in_progress') {
    return { text: 'text-amber-600', dot: 'bg-amber-500' };
  }
  if (s === 'draft' || s === 'open') {
    return { text: 'text-blue-600', dot: 'bg-blue-500' };
  }
  return { text: 'text-gray-600', dot: 'bg-gray-500' };
}

export default async function Overview() {
  const session = await getSession();
  
  if (!session || !session.id) {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.id as string },
    include: {
      contracts: {
        orderBy: { updatedAt: 'desc' },
        take: 4
      },
      tasks: {
        where: { status: 'Open' },
        orderBy: { dueDate: 'asc' },
        take: 5
      },
      activities: {
        orderBy: { timestamp: 'desc' },
        take: 10
      }
    }
  });

  if (!user) {
    redirect('/login');
  }

  const activities = user.activities.map(activity => ({
    id: activity.id,
    text: `${activity.description} was ${activity.action}`,
    time: getTimeAgo(activity.timestamp),
    active: true // You might want to determine this based on read/unread status if you add that later
  }));

  const contracts = user.contracts.map(contract => {
    const colors = getStatusColor(contract.status);
    return {
      id: contract.id,
      contractNumber: contract.contractNumber,
      title: contract.title,
      type: contract.type,
      status: contract.status,
      statusColor: colors.text,
      dotColor: colors.dot
    };
  });

  const tasks = user.tasks;

  return (
    <div className="space-y-12">
      {/* Header Greeting */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Hello {user.name || 'User'} – what would you like to do today?</h1>
        <p className="text-gray-500 mt-2 text-lg">I can help you manage your contracts and more.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity Section */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-gray-700">Recent Activity</h2>
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 min-h-[300px]">
            {activities.length > 0 ? (
              <div className="relative pl-4 space-y-8">
                {/* Vertical Line */}
                <div className="absolute left-[21px] top-3 bottom-3 w-0.5 bg-gray-200" />

                {activities.map((activity) => (
                  <div key={activity.id} className="relative flex items-center gap-6">
                    {/* Dot */}
                    <div className="absolute left-0 w-11 h-11 flex items-center justify-center bg-white z-10">
                      <div className="w-3 h-3 rounded-full bg-blue-500 ring-4 ring-blue-50" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex items-center justify-between ml-12">
                      <span className="font-medium text-blue-600">{activity.text}</span>
                      <span className="text-sm text-gray-400">{activity.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <p>No recent activity</p>
              </div>
            )}
          </div>
        </div>

        {/* Tasks Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-700">My Tasks ({tasks.length})</h2>
            <button className="text-sm text-blue-600 hover:underline">All Tasks</button>
          </div>

          {tasks.length > 0 ? (
            <div className="space-y-4">
              {tasks.map(task => (
                <div key={task.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative group hover:shadow-md transition-shadow">
                  {/* Top red accent for tasks due soon or high priority - for now just red for all open tasks */}
                  <div className="h-1 w-full bg-red-500 absolute top-0" />

                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-blue-900 text-lg">{task.title}</h3>
                      {task.dueDate && (
                        <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded">
                          {getTimeAgo(task.dueDate)}
                        </span>
                      )}
                    </div>

                    <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                      <span>{task.status} • {task.type || 'General'}</span>
                      {task.contractId && <span className="text-gray-400">Linked to Contract</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
             <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center text-gray-400 h-[200px] flex items-center justify-center">
               <p>No open tasks</p>
             </div>
          )}
        </div>
      </div>

      {/* Contracts Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-700">My Contracts ({contracts.length})</h2>
          <Link href="/contracts" className="text-sm text-blue-600 hover:underline">
            All Contracts
          </Link>
        </div>

        {contracts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contracts.map((contract) => (
              <Link 
                href={`/contracts/${contract.id}`} 
                key={contract.id} 
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer group block"
              >
                {/* Document Preview Placeholder */}
                <div className="bg-gray-50 rounded-xl h-32 mb-4 flex items-center justify-center border border-gray-100 group-hover:bg-gray-100 transition-colors relative">
                  <FileText className="w-10 h-10 text-gray-300" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
                    <span className="text-xs font-semibold text-gray-600 bg-white/90 px-2 py-1 rounded shadow-sm">Click to edit</span>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="min-w-0">
                      <h3 className="font-bold text-blue-900 truncate" title={contract.title}>{contract.title}</h3>
                      <p className="text-xs text-gray-500 mt-1">{contract.type}</p>
                    </div>
                    <div className="p-1.5 rounded-full border border-gray-200 text-gray-400 shrink-0">
                      <FileIcon className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-50 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${contract.dotColor}`} />
                      <span className={`font-medium ${contract.statusColor}`}>{contract.status}</span>
                    </div>
                    <span className="text-gray-400">{contract.contractNumber}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center text-gray-400">
             <p>No contracts found</p>
          </div>
        )}
      </div>
    </div>
  );
}
