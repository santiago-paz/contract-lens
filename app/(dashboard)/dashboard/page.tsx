import { FileIcon, FileText, CheckCircle2, AlertCircle, Clock, ArrowRight, Terminal } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { getSessionWithOrg } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

function getTimeAgo(date: Date) {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} MIN${diffInMinutes > 1 ? 'S' : ''} AGO`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} HR${diffInHours > 1 ? 'S' : ''} AGO`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return 'YESTERDAY';
  if (diffInDays < 7) return `${diffInDays} DAYS AGO`;
  
  return date.toLocaleDateString().toUpperCase();
}

function getStatusStyle(status: string) {
  const s = status.toLowerCase();
  if (s === 'active' || s === 'completed' || s === 'approved') {
    return { bg: 'bg-[#CCFF00]', text: 'text-black', border: 'border-black' };
  }
  if (s === 'review' || s === 'pending' || s === 'in_progress') {
    return { bg: 'bg-white', text: 'text-black', border: 'border-gray-300' };
  }
  if (s === 'draft' || s === 'open') {
    return { bg: 'bg-gray-100', text: 'text-black', border: 'border-gray-300' };
  }
  return { bg: 'bg-white', text: 'text-gray-500', border: 'border-gray-200' };
}

export default async function Overview() {
  const session = await getSessionWithOrg();

  if (!session) {
    redirect('/login');
  }

  // Fetch contracts, tasks, and activities scoped to the organization
  const [contracts, tasks, activities, userName] = await Promise.all([
    prisma.contract.findMany({
      where: { organizationId: session.orgId },
      orderBy: { updatedAt: 'desc' },
      take: 4,
      select: {
        id: true,
        contractNumber: true,
        title: true,
        type: true,
        status: true,
      },
    }),
    prisma.task.findMany({
      where: { userId: session.userId, status: 'Open' },
      orderBy: { dueDate: 'asc' },
      take: 5,
      select: {
        id: true,
        title: true,
        dueDate: true,
        status: true,
        type: true,
      },
    }),
    prisma.activity.findMany({
      where: { userId: session.userId },
      orderBy: { timestamp: 'desc' },
      take: 20,
      select: {
        id: true,
        description: true,
        action: true,
        timestamp: true,
        contractId: true,
      },
    }),
    Promise.resolve(session.name),
  ]);

  // Group consecutive activities
  const groupedActivities = activities.reduce((acc, activity) => {
    const last = acc[acc.length - 1];
    
    // Check if same description and action, and action is 'updated'
    // We only group 'updated' actions to avoid hiding distinct creations/deletions
    if (last && 
        last.originalDescription === activity.description && 
        last.originalAction === activity.action && 
        activity.action === 'updated') {
      
      last.count = (last.count || 1) + 1;
      // We keep the time of the most recent one (the first one encountered)
      return acc;
    }
    
    acc.push({
      id: activity.id,
      originalDescription: activity.description,
      originalAction: activity.action,
      text: `${activity.description} was ${activity.action}`,
      time: getTimeAgo(activity.timestamp),
      active: true,
      count: 1,
      contractId: activity.contractId,
    });
    
    return acc;
  }, [] as any[]).slice(0, 7); // Take top 7 after grouping

  const contractCards = contracts.map(contract => {
    const style = getStatusStyle(contract.status);
    // Only show contractNumber if it's a real external reference (not auto-generated)
    const hasRealReference = !contract.contractNumber.startsWith('CNT-');
    return {
      id: contract.id,
      contractNumber: hasRealReference ? contract.contractNumber : null,
      title: contract.title,
      type: contract.type,
      status: contract.status,
      style
    };
  });

  return (
    <div className="space-y-12">
      {/* Header Greeting */}
      <div className="bg-white border border-gray-200 p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 rounded-sm">
        <div>
           <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-[#CCFF00] rounded-full animate-pulse"></div>
                <span className="text-[10px] font-bold uppercase text-gray-500 tracking-wider">System Online</span>
           </div>
           <h1 className="text-3xl font-black font-sans uppercase tracking-tighter text-black">
              Welcome back, {userName?.split(' ')[0] || 'User'}
           </h1>
           <p className="text-gray-500 text-sm mt-1 uppercase font-medium">Ready to manage operations.</p>
        </div>
        <Link 
            href="/contract-creator"
            className="group flex items-center gap-2 px-4 py-2 bg-black text-white border border-black shadow-hard hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all active:bg-[#CCFF00] active:text-black"
        >
            <span className="text-xs font-bold font-mono uppercase">Initiate Contract</span>
            <ArrowRight className="w-4 h-4 group-active:text-black" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity Section */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-200 pb-2">
            <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-gray-400" />
                <h2 className="text-sm font-bold uppercase text-black">System Logs</h2>
            </div>
            <button className="text-[10px] font-bold uppercase text-gray-500 hover:text-black transition-colors">View All</button>
          </div>
          
          <div className="bg-white border border-gray-200 shadow-sm rounded-sm min-h-[300px] overflow-hidden">
             {/* Terminal Header */}
             <div className="bg-gray-50 px-4 py-2 flex justify-between items-center border-b border-gray-200">
                <span className="font-mono text-[10px] uppercase text-gray-500 font-bold">ACTIVITY_STREAM.LOG</span>
                <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-200"></div>
                </div>
             </div>
             
            {groupedActivities.length > 0 ? (
              <div className="p-6 font-mono text-xs space-y-6">
                {groupedActivities.map((activity, idx) => (
                  <div key={activity.id} className="relative flex gap-4 group">
                    <div className="w-24 text-gray-400 shrink-0 pt-0.5 text-right uppercase">{activity.time}</div>
                    <div className="relative">
                         <div className="w-1.5 h-1.5 bg-gray-300 mt-1 z-10 relative group-hover:bg-[#CCFF00] transition-colors rounded-full"></div>
                         {idx !== groupedActivities.length - 1 && (
                            <div className="absolute top-2.5 left-[2.5px] w-px h-[calc(100%+24px)] bg-gray-100 -z-0"></div>
                         )}
                    </div>
                    <div className="flex-1 pb-1 border-b border-gray-50 group-last:border-0">
                      <p className="text-gray-700 uppercase leading-relaxed">
                        {activity.contractId ? (
                          <Link href={`/contracts/${activity.contractId}`} className="hover:text-black underline decoration-gray-300 hover:decoration-black underline-offset-2 transition-colors">
                            {activity.text}
                          </Link>
                        ) : (
                          activity.text
                        )}
                        {activity.count > 1 && (
                           <span className="ml-2 inline-flex items-center justify-center bg-gray-100 text-gray-500 text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
                             ×{activity.count}
                           </span>
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[300px] text-gray-400 font-mono uppercase text-xs">
                <p>No system activity detected</p>
              </div>
            )}
          </div>
        </div>

        {/* Tasks Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-gray-200 pb-2">
            <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-gray-400" />
                <h2 className="text-sm font-bold uppercase text-black">Pending Tasks ({tasks.length})</h2>
            </div>
            <button className="text-[10px] font-bold uppercase text-gray-500 hover:text-black transition-colors">View All</button>
          </div>

          {tasks.length > 0 ? (
            <div className="space-y-3">
              {tasks.map(task => (
                <div key={task.id} className="bg-white border border-gray-200 p-4 shadow-sm hover:border-black transition-colors relative group rounded-sm">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-black uppercase text-xs leading-snug">{task.title}</h3>
                    {task.dueDate && (
                      <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 uppercase shrink-0 rounded-sm">
                        {getTimeAgo(task.dueDate)}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono border-t border-gray-100 pt-2 mt-2">
                    <span className="uppercase text-gray-600">{task.status}</span>
                    <span className="text-gray-400 uppercase">{task.type || 'GEN'}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
             <div className="bg-white border border-gray-200 p-8 shadow-sm text-center text-gray-400 h-[200px] flex items-center justify-center font-mono uppercase text-xs rounded-sm">
               <p>All tasks cleared</p>
             </div>
          )}
        </div>
      </div>

      {/* Contracts Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-gray-200 pb-2">
            <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-400" />
                <h2 className="text-sm font-bold uppercase text-black">Active Contracts ({contractCards.length})</h2>
            </div>
          <Link href="/contracts" className="text-[10px] font-bold uppercase text-gray-500 hover:text-black transition-colors">
            View Archive
          </Link>
        </div>

        {contractCards.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {contractCards.map((contract) => (
              <Link 
                href={`/contracts/${contract.id}`} 
                key={contract.id} 
                className="group flex flex-col bg-white border border-gray-200 hover:border-black shadow-sm transition-all rounded-sm overflow-hidden"
              >
                {/* Header Strip */}
                <div className="h-7 bg-gray-50 flex items-center justify-between px-3 border-b border-gray-200 group-hover:bg-black transition-colors shrink-0">
                    <span className="text-[10px] font-mono font-bold text-gray-500 group-hover:text-white uppercase truncate">
                      {contract.contractNumber ? `REF ${contract.contractNumber}` : contract.type}
                    </span>
                    <div className="w-1.5 h-1.5 bg-gray-300 group-hover:bg-[#CCFF00] rounded-full"></div>
                </div>

                <div className="p-4 flex-1 flex flex-col">
                    <div className="h-20 flex items-center justify-center border border-dashed border-gray-200 mb-3 bg-white group-hover:border-gray-300 transition-colors relative overflow-hidden rounded-sm shrink-0">
                        <FileText className="w-6 h-6 text-gray-300 group-hover:text-black transition-colors" />
                    </div>

                    <div className="flex-1 flex flex-col">
                        <h3 className="font-bold text-black text-xs uppercase truncate leading-tight group-hover:underline decoration-1 underline-offset-2 mb-2" title={contract.title}>{contract.title}</h3>
                        
                        <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-auto">
                            <span className="text-[10px] text-gray-400 uppercase">{contract.type}</span>
                            <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 border ${contract.style.bg === 'bg-white' ? 'bg-white' : contract.style.bg} ${contract.style.text} ${contract.style.border} rounded-sm`}>
                                {contract.status}
                            </span>
                        </div>
                    </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-gray-200 p-12 shadow-sm text-center text-gray-400 font-mono uppercase text-xs rounded-sm">
             <p>No contracts in database</p>
          </div>
        )}
      </div>
    </div>
  );
}
