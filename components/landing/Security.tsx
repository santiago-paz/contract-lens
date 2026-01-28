import { Shield, Lock, Globe, Server } from 'lucide-react';

export function Security() {
  return (
    <div className="py-20 border-t border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-gray-50 border border-gray-200">
                <div className="p-3 bg-blue-50 rounded-xl mb-4 text-blue-600 border border-blue-100">
                    <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">AES-256 Encryption</h3>
                <p className="text-sm text-gray-600">Your data is encrypted at rest and in transit. Enterprise-grade security standard.</p>
            </div>
             <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-gray-50 border border-gray-200">
                <div className="p-3 bg-indigo-50 rounded-xl mb-4 text-indigo-600 border border-indigo-100">
                    <Shield className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Zero-Retention AI</h3>
                <p className="text-sm text-gray-600">Our AI models process your data without storing it for training. Your IP remains yours.</p>
            </div>
             <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-gray-50 border border-gray-200">
                <div className="p-3 bg-green-50 rounded-xl mb-4 text-green-600 border border-green-100">
                    <Server className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Sovereign Hosting</h3>
                <p className="text-sm text-gray-600">Choose where your data lives. Full compliance with EU GDPR and US privacy laws.</p>
            </div>
        </div>
      </div>
    </div>
  );
}
