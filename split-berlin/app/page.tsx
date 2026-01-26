import Link from 'next/link';
import { FileText } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-2xl w-full text-center space-y-8">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
          Split Berlin
        </h1>
        <p className="text-xl text-gray-600">
          Sistema de gestión de contratos y acuerdos legales.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <Link 
            href="/contract-creator"
            className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-200 group"
          >
            <div className="p-3 bg-blue-50 rounded-full group-hover:bg-blue-100 transition-colors mb-4">
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Creador de Contratos</h2>
            <p className="text-sm text-gray-500 mt-2">
              Redacta y personaliza tus contratos bilingües.
            </p>
          </Link>
          
          {/* Placeholder for future features */}
          <div className="flex flex-col items-center p-6 bg-gray-100 rounded-xl border border-gray-200 opacity-60 cursor-not-allowed">
            <div className="p-3 bg-gray-200 rounded-full mb-4">
              <span className="text-2xl">🔜</span>
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Próximamente</h2>
            <p className="text-sm text-gray-500 mt-2">
              Más herramientas en desarrollo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
