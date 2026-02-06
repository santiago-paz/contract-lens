import { Search, FileText, ChevronRight, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { CONTRACT_TYPES } from '@/lib/constants';

interface TypeSelectionStepProps {
  onSelect: (type: string) => void;
  onBack: () => void;
  suggestedType?: string;
}

/** Insert a space before each uppercase letter that follows a lowercase letter */
function formatTypeName(type: string): string {
  return type.replace(/([a-z])([A-Z])/g, '$1 $2');
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
    <div className="w-full max-w-5xl mx-auto animate-fade-in font-mono">
        <div className="mb-6">
            <h2 className="text-2xl font-black text-black flex items-center gap-3 uppercase tracking-tighter">
            <div className="p-2 bg-black text-[#CCFF00] border-2 border-black">
                <FileText className="w-6 h-6" />
            </div>
            Classify Contract
            </h2>
             <p className="text-gray-600 mt-2 max-w-xl pl-14 text-xs font-bold uppercase">
                Select applicable legal framework
            </p>
        </div>

        <div className="bg-white border-2 border-black shadow-hard p-8 min-h-[500px]">
            <div className="max-w-3xl mx-auto">
                <div className="relative mb-8">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-black" />
                    <input 
                        type="text"
                        placeholder="SEARCH CONTRACT TYPES..."
                        className="w-full pl-10 pr-4 py-4 bg-white border-2 border-black font-bold uppercase focus:outline-none focus:bg-[#CCFF00] transition-all placeholder:text-gray-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        autoFocus
                    />
                </div>

                <div className="mb-6">
                    <div className="mb-4">
                        <h3 className="text-xs font-bold text-black uppercase tracking-widest pb-2 border-b-2 border-black flex items-center gap-2">
                            <FileText className="w-4 h-4 shrink-0" />
                            Available Definitions
                        </h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredTypes.map((type) => {
                            const isSuggested = type === suggestedType;
                            const isSelected = selectedType === type;
                            return (
                            <div 
                                key={type}
                                onClick={() => setSelectedType(type)}
                                className={`
                                    group flex items-center justify-between p-4 cursor-pointer transition-all border-2
                                    ${isSelected 
                                        ? 'bg-black text-white border-black shadow-hard-sm scale-[1.01]' 
                                        : isSuggested
                                            ? 'bg-[#CCFF00]/20 border-black text-black hover:bg-[#CCFF00] hover:shadow-hard-sm'
                                            : 'bg-white border-gray-200 text-gray-500 hover:border-black hover:text-black hover:shadow-hard-sm'
                                    }
                                `}
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    {isSuggested ? (
                                        <Sparkles className={`w-4 h-4 shrink-0 ${isSelected ? 'text-[#CCFF00]' : 'text-black'}`} />
                                    ) : (
                                        <FileText className={`w-4 h-4 shrink-0 ${isSelected ? 'text-gray-400' : 'text-gray-400 group-hover:text-black'}`} />
                                    )}
                                    <div className="flex items-center gap-2 min-w-0">
                                        <span className="font-bold text-sm uppercase truncate">
                                            {formatTypeName(type)}
                                        </span>
                                        {isSuggested && (
                                            <span className={`shrink-0 text-[10px] px-1.5 py-0.5 border uppercase tracking-wide font-bold ${isSelected ? 'bg-[#CCFF00] text-black border-[#CCFF00]' : 'bg-black text-white border-black'}`}>
                                                Suggested
                                            </span>
                                        )}
                                    </div>
                                </div>
                                
                                {isSelected && (
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onSelect(type);
                                        }}
                                        className="shrink-0 ml-3 px-3 py-1 bg-white text-black border-2 border-black text-xs font-bold uppercase hover:bg-[#CCFF00] transition-colors flex items-center gap-1 animate-fade-in"
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
