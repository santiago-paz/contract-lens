import { FileIcon, FileText, CheckCircle2, AlertCircle, Clock, ArrowRight, Terminal } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
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
    return { bg: 'bg-white', text: 'text-black', border: 'border-black' }; // Use striped background maybe?
  }
  if (s === 'draft' || s === 'open') {
    return { bg: 'bg-gray-200', text: 'text-black', border: 'border-black' };
  }
  return { bg: 'bg-white', text: 'text-gray-500', border: 'border-gray-400' };
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
        take: 7
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
    active: true 
  }));

  const contracts = user.contracts.map(contract => {
    const style = getStatusStyle(contract.status);
    return {
      id: contract.id,
      contractNumber: contract.contractNumber,
      title: contract.title,
      type: contract.type,
      status: contract.status,
      style
    };
  });

  const tasks = user.tasks;

  return (
    <div className="space-y-12">
      {/* Header Greeting */}
      <div className="bg-white border border-black p-6 shadow-hard flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
           <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-[#CCFF00] border border-black animate-pulse"></div>
                <span className="text-xs font-mono font-bold uppercase text-black">System Online</span>
           </div>
           <h1 className="text-3xl md:text-4xl font-black font-mono uppercase tracking-tighter text-black">
              Welcome back, {user.name?.split(' ')[0] || 'User'}
           </h1>
           <p className="text-gray-600 font-mono text-sm mt-2 uppercase">Ready to manage operations.</p>
        </div>
        <Link 
            href="/contract-creator"
            className="group flex items-center gap-2 px-6 py-3 bg-black text-white border border-black hover:bg-[#CCFF00] hover:text-black transition-all shadow-hard-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
        >
            <span className="font-bold font-mono uppercase text-sm">Initiate Contract</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity Section */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-black pb-2">
            <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5" />
                <h2 className="text-xl font-bold font-mono uppercase text-black">System Logs</h2>
            </div>
            <button className="text-xs font-bold font-mono uppercase text-black hover:bg-[#CCFF00] px-2 py-1 transition-colors">View All Logs</button>
          </div>
          
          <div className="bg-white border border-black p-0 shadow-hard-sm min-h-[300px]">
             {/* Terminal Header */}
             <div className="bg-black text-white px-4 py-2 flex justify-between items-center border-b border-black">
                <span className="font-mono text-xs uppercase">ACTIVITY_STREAM.LOG</span>
                <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-[#CCFF00]"></div>
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                </div>
             </div>
             
            {activities.length > 0 ? (
              <div className="p-6 font-mono text-sm space-y-6">
                {activities.map((activity, idx) => (
                  <div key={activity.id} className="relative flex gap-4 group">
                    <div className="w-24 text-gray-400 text-xs shrink-0 pt-0.5 text-right uppercase">{activity.time}</div>
                    <div className="relative">
                         <div className="w-2 h-2 bg-black mt-1.5 z-10 relative group-hover:bg-[#CCFF00] transition-colors border border-black"></div>
                         {idx !== activities.length - 1 && (
                            <div className="absolute top-3 left-[3px] w-px h-[calc(100%+24px)] bg-gray-200 -z-0"></div>
                         )}
                    </div>
                    <div className="flex-1 pb-1 border-b border-gray-100 group-last:border-0">
                      <p className="text-black uppercase leading-relaxed">{activity.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[300px] text-gray-400 font-mono uppercase">
                <p>No system activity detected</p>
              </div>
            )}
          </div>
        </div>

        {/* Tasks Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-black pb-2">
            <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                <h2 className="text-xl font-bold font-mono uppercase text-black">Pending Tasks ({tasks.length})</h2>
            </div>
            <button className="text-xs font-bold font-mono uppercase text-black hover:bg-[#CCFF00] px-2 py-1 transition-colors">All Tasks</button>
          </div>

          {tasks.length > 0 ? (
            <div className="space-y-4">
              {tasks.map(task => (
                <div key={task.id} className="bg-white border border-black p-4 shadow-hard-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all relative group">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold font-mono text-black uppercase text-sm leading-tight">{task.title}</h3>
                    {task.dueDate && (
                      <span className="text-[10px] font-bold font-mono text-white bg-black px-1.5 py-0.5 uppercase shrink-0">
                        {getTimeAgo(task.dueDate)}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono border-t border-black pt-2 mt-2">
                    <span className="uppercase">{task.status}</span>
                    <span className="text-gray-500 uppercase">{task.type || 'GEN'}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
             <div className="bg-white border border-black p-8 shadow-hard-sm text-center text-gray-400 h-[200px] flex items-center justify-center font-mono uppercase">
               <p>All tasks cleared</p>
             </div>
          )}
        </div>
      </div>

      {/* Contracts Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-black pb-2">
            <div className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                <h2 className="text-xl font-bold font-mono uppercase text-black">Active Contracts ({contracts.length})</h2>
            </div>
          <Link href="/contracts" className="text-xs font-bold font-mono uppercase text-black hover:bg-[#CCFF00] px-2 py-1 transition-colors">
            View Archive
          </Link>
        </div>

        {contracts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contracts.map((contract) => (
              <Link 
                href={`/contracts/${contract.id}`} 
                key={contract.id} 
                className="group block bg-white border border-black p-0 shadow-hard hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all"
              >
                {/* Header Strip */}
                <div className="h-8 bg-black flex items-center justify-between px-3 border-b border-black group-hover:bg-[#CCFF00] transition-colors">
                    <span className="text-xs font-mono font-bold text-white group-hover:text-black uppercase truncate">{contract.contractNumber}</span>
                    <div className="w-2 h-2 bg-[#CCFF00] group-hover:bg-black rounded-full"></div>
                </div>

                <div className="p-5">
                    <div className="h-24 flex items-center justify-center border border-dashed border-gray-300 mb-4 bg-gray-50 group-hover:border-black transition-colors relative overflow-hidden">
                        <FileText className="w-8 h-8 text-gray-300 group-hover:text-black transition-colors" />
                        <div className="absolute inset-0 bg-[#CCFF00]/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>

                    <div className="space-y-3">
                        <h3 className="font-bold font-mono text-black text-sm uppercase truncate leading-tight" title={contract.title}>{contract.title}</h3>
                        
                        <div className="flex items-center justify-between pt-2 border-t border-black">
                            <span className="text-[10px] font-mono uppercase text-gray-500">{contract.type}</span>
                            <span className={`text-[10px] font-bold font-mono uppercase px-1.5 py-0.5 border border-black ${contract.style.bg} ${contract.style.text}`}>
                                {contract.status}
                            </span>
                        </div>
                    </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-black p-12 shadow-hard text-center text-gray-400 font-mono uppercase">
             <p>No contracts in database</p>
          </div>
        )}
      </div>
    </div>
  );
}
