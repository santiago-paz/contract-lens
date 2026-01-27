import { Search, FileText, ChevronRight, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { CONTRACT_TYPES } from '@/lib/constants';

interface TypeSelectionStepProps {
  onSelect: (type: string) => void;
  onBack: () => void;
  suggestedType?: string;
}


export function TypeSelectionStep({ onSelect, onBack, suggestedType }: TypeSelectionStepProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);

  // Auto-select suggested type if available
  useEffect(() => {
    if (suggestedType) {
        setSelectedType(suggestedType);
    }
  }, [suggestedType]);

  const filteredTypes = CONTRACT_TYPES.filter(t => 
    t.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full max-w-5xl mx-auto animate-fade-in">
        <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
            </div>
            New Contract
            </h2>
             <p className="text-gray-500 mt-2 max-w-xl pl-12">
                Continue by selecting a (suggested) contract type
            </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 min-h-[500px]">
            <div className="max-w-3xl mx-auto">
                <div className="relative mb-8">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                        type="text"
                        placeholder="Search for contract types"
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        autoFocus
                    />
                </div>

                <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Contract Types
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                        {filteredTypes.map((type) => {
                            const isSuggested = type === suggestedType;
                            return (
                            <div 
                                key={type}
                                onClick={() => setSelectedType(type)}
                                className={`
                                    group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all border
                                    ${selectedType === type 
                                        ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm' 
                                        : isSuggested
                                            ? 'bg-green-50 border-green-200 text-green-700 shadow-sm'
                                            : 'bg-white border-transparent hover:bg-gray-50 text-gray-600 hover:text-gray-900'
                                    }
                                `}
                            >
                                <div className="flex items-center gap-3">
                                    {isSuggested ? (
                                        <Sparkles className="w-4 h-4 text-green-600" />
                                    ) : (
                                        <FileText className={`w-4 h-4 ${selectedType === type ? 'text-blue-500' : 'text-gray-400'}`} />
                                    )}
                                    <span className="font-medium">
                                        {type}
                                        {isSuggested && <span className="ml-2 text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full uppercase tracking-wide font-bold">Suggested</span>}
                                    </span>
                                </div>
                                
                                {selectedType === type && (
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onSelect(type);
                                        }}
                                        className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 transition-colors flex items-center gap-1 animate-fade-in"
                                    >
                                        Next
                                        <ChevronRight className="w-3 h-3" />
                                    </button>
                                )}
                            </div>
                        )})}

                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
