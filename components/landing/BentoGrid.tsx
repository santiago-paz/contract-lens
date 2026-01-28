'use client';

import { motion } from 'framer-motion';
import { Check, Loader2, FileText, Bell, Users, Calendar } from 'lucide-react';

export function BentoGrid() {
  return (
    <div id="bento-grid" className="py-24 relative bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">More Than Files: A Command Center</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            SplitBerlin is a complete suite for managing your contract lifecycle.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(300px,auto)]">
          {/* Card 1: Ingestion Wizard - Large span */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-2 bg-white border border-gray-200 rounded-2xl p-8 overflow-hidden relative group hover:border-blue-300 transition-colors shadow-sm hover:shadow-md"
          >
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-50 rounded-lg border border-blue-100">
                        <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Smart Ingestion</h3>
                </div>
                <p className="text-gray-600 mb-8 max-w-md">
                    It doesn't just read, it understands structure and validates vendors against global databases.
                </p>

                {/* Mock UI */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 max-w-lg mx-auto transform group-hover:scale-[1.02] transition-transform duration-500">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-900">Contract Analysis</span>
                            <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">Processing</span>
                        </div>
                        <div className="space-y-3">
                            {['Structure Analysis', 'Partner Identification', 'Date Extraction'].map((step, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-full bg-green-50 text-green-600 flex items-center justify-center border border-green-100">
                                        <Check className="w-3.5 h-3.5" />
                                    </div>
                                    <div className="h-2 bg-gray-100 rounded w-full overflow-hidden">
                                        <div className="h-full bg-green-500 w-full" style={{ width: '100%' }}></div>
                                    </div>
                                </div>
                            ))}
                             <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                </div>
                                <div className="text-sm text-gray-600 font-medium">Validating Metadata...</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          </motion.div>

          {/* Card 2: Proactive Guard - Alert */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="md:col-span-1 bg-white border border-gray-200 rounded-2xl p-8 relative overflow-hidden group hover:border-red-200 transition-colors shadow-sm hover:shadow-md"
          >
             <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-red-50 rounded-lg border border-red-100">
                        <Bell className="w-6 h-6 text-red-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Proactive Guard</h3>
                </div>
                <p className="text-gray-600 mb-8">
                    Your CFO will sleep soundly. Automatic alerts with no configuration.
                </p>

                {/* Mock Notification */}
                <div className="space-y-3">
                    <div className="bg-white rounded-lg p-3 shadow-md border border-gray-100 border-l-4 border-l-red-500 transform translate-x-2 group-hover:translate-x-0 transition-transform">
                        <div className="flex items-start gap-3">
                            <div className="mt-0.5">
                                <Calendar className="w-4 h-4 text-red-500" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-900">Salesforce Renewal</p>
                                <p className="text-xs text-gray-500">Expires in 30 days. Action required.</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white/80 rounded-lg p-3 shadow-sm border border-gray-100 border-l-4 border-l-blue-500 transform translate-x-6 group-hover:translate-x-4 transition-transform opacity-75">
                         <div className="flex items-start gap-3">
                            <div className="mt-0.5">
                                <Users className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-900">Approval Needed</p>
                            </div>
                        </div>
                    </div>
                </div>
             </div>
          </motion.div>

          {/* Card 3: Partner & Task Management */}
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="md:col-span-3 bg-white border border-gray-200 rounded-2xl p-8 overflow-hidden relative group hover:border-indigo-200 transition-colors shadow-sm hover:shadow-md"
          >
             <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
                <div>
                     <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-indigo-50 rounded-lg border border-indigo-100">
                            <Users className="w-6 h-6 text-indigo-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">Real Collaboration</h3>
                    </div>
                    <p className="text-gray-600 mb-6">
                        Assign tasks directly on the contract and group documents by vendor. No more email threads.
                    </p>
                    
                    <ul className="space-y-3 text-gray-600">
                        <li className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-indigo-500" />
                            <span>Assign specific clauses to legal</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-indigo-500" />
                            <span>Track approval workflows</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-indigo-500" />
                            <span>Vendor-centric document view</span>
                        </li>
                    </ul>
                </div>

                {/* Visuals Side */}
                <div className="relative h-full min-h-[250px] flex items-center justify-center">
                    {/* Partner Card */}
                    <div className="absolute top-0 left-10 bg-white rounded-xl p-4 shadow-lg border border-gray-200 w-64 transform -rotate-3 hover:rotate-0 transition-transform duration-300 z-10">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold">G</div>
                            <div>
                                <div className="text-sm font-bold text-gray-900">Google LLC</div>
                                <div className="text-xs text-gray-500">Partner Intelligence</div>
                            </div>
                        </div>
                        <div className="flex gap-2 text-xs">
                             <div className="bg-green-50 text-green-700 px-2 py-1 rounded">3 Active</div>
                             <div className="bg-red-50 text-red-700 px-2 py-1 rounded">1 Expiring</div>
                        </div>
                    </div>

                    {/* Task Card */}
                    <div className="absolute bottom-0 right-10 bg-white rounded-xl p-4 shadow-lg border border-gray-200 w-64 transform rotate-3 hover:rotate-0 transition-transform duration-300 z-20">
                         <div className="flex items-center gap-2 mb-2">
                            <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold">S</div>
                            <span className="text-xs text-gray-500">@Sarah assigned to you</span>
                         </div>
                         <p className="text-sm font-medium text-gray-900">"Review Liability Clause"</p>
                         <div className="mt-2 text-xs text-gray-400">Due tomorrow</div>
                    </div>
                </div>
             </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
