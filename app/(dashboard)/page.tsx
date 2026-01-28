'use client';

import { FileIcon, FileText } from 'lucide-react';

// Temporary mock data for presentation
const ACTIVITIES = [
  {
    id: 1,
    text: 'Partnership GCC GRC DAY was updated',
    time: '1 hour ago',
    active: true, // Blue dot
  },
  {
    id: 2,
    text: 'Partnership GCC GRC DAY was created',
    time: 'Yesterday',
    active: true,
  },
  {
    id: 3,
    text: 'Sponsoring SWISS GRC DAY 2025 was restored',
    time: 'Yesterday',
    active: true,
  },
  {
    id: 4,
    text: 'Sponsoring SWISS GRC DAY 2025 was deleted',
    time: 'Yesterday',
    active: true,
  },
  {
    id: 5,
    text: 'Sponsoring SWISS GRC DAY 2025 was created',
    time: '2 days ago',
    active: true,
  },
  {
    id: 6,
    text: 'CWS-boco Schweiz AG was updated',
    time: '04/08/2025',
    active: true,
  },
];

const CONTRACTS = [
  {
    id: '10023',
    title: 'Partnership GCC GRC DAY',
    type: 'Sponsorship Contract',
    status: 'Active',
    statusColor: 'text-emerald-600',
    dotColor: 'bg-emerald-500',
  },
  {
    id: '10022',
    title: 'Sponsoring SWISS GRC DAY 2025',
    type: 'Sponsorship Contract',
    status: 'Review',
    statusColor: 'text-amber-600',
    dotColor: 'bg-amber-500',
  },
  {
    id: '10006',
    title: 'License Agreement GRC Toolbox SaaS',
    type: 'License Contract',
    status: 'Active',
    statusColor: 'text-emerald-600',
    dotColor: 'bg-emerald-500',
  },
  {
    id: '10002',
    title: 'HubSpot Service Contract',
    type: 'Service Contract',
    status: 'Active',
    statusColor: 'text-emerald-600',
    dotColor: 'bg-emerald-500',
  },
];

export default function Overview() {
  return (
    <div className="space-y-12">
      {/* Header Greeting */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Hello Irem Cengiz – what would you like to do today?</h1>
        <p className="text-gray-500 mt-2 text-lg">I can help you manage your contracts and more.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity Section */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-gray-700">Recent Activity</h2>
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="relative pl-4 space-y-8">
              {/* Vertical Line */}
              <div className="absolute left-[21px] top-3 bottom-3 w-0.5 bg-gray-200" />

              {ACTIVITIES.map((activity, idx) => (
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
          </div>
        </div>

        {/* Tasks Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-700">My Tasks (1)</h2>
            <button className="text-sm text-blue-600 hover:underline">All Tasks</button>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative group hover:shadow-md transition-shadow">
            {/* Top red accent */}
            <div className="h-1 w-full bg-red-500 absolute top-0" />

            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-blue-900 text-lg">Update Sponsorship Contracts</h3>
                <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded">Tomorrow</span>
              </div>

              <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                <span>Open • License Agreement</span>
                <span className="text-gray-400">License Agreement GRC Toolbox SaaS</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contracts Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-700">My Contracts (4)</h2>
          <button className="text-sm text-blue-600 hover:underline">All Contracts</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CONTRACTS.map((contract) => (
            <div key={contract.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer group">
              {/* Document Preview Placeholder */}
              <div className="bg-gray-50 rounded-xl h-32 mb-4 flex items-center justify-center border border-gray-100 group-hover:bg-gray-100 transition-colors">
                <FileText className="w-10 h-10 text-gray-300" />
              </div>

              {/* Content */}
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-blue-900 truncate max-w-[140px]" title={contract.title}>{contract.title}</h3>
                    <p className="text-xs text-gray-500 mt-1">{contract.type}</p>
                  </div>
                  <div className="p-1.5 rounded-full border border-gray-200 text-gray-400">
                    <FileIcon className="w-4 h-4" />
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-50 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${contract.dotColor}`} />
                    <span className={`font-medium ${contract.statusColor}`}>{contract.status}</span>
                  </div>
                  <span className="text-gray-400">{contract.id}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
