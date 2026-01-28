import Link from 'next/link';
import { ArrowRight, Globe } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl p-8 sm:p-12 text-center mb-16 relative overflow-hidden shadow-xl">
             <div className="relative z-10">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                    How much did the last renewal you forgot to cancel cost you?
                </h2>
                <div className="mt-8 flex justify-center">
                    <Link
                    href="/login"
                    className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold rounded-xl text-blue-600 bg-white hover:bg-gray-50 transition-all shadow-lg"
                    >
                    Stop the losses
                    <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                </div>
             </div>
             {/* Abstract BG Pattern */}
             <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-t border-gray-100 pt-8">
            <div className="flex items-center gap-2">
                <div className="bg-blue-600 p-1 rounded-md">
                    <Globe className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold text-gray-900">SplitBerlin</span>
            </div>
            <div className="text-sm text-gray-500">
                © {new Date().getFullYear()} SplitBerlin. All rights reserved.
            </div>
            <div className="flex gap-6">
                <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">Privacy</a>
                <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">Terms</a>
                <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">Twitter</a>
            </div>
        </div>
      </div>
    </footer>
  );
}
