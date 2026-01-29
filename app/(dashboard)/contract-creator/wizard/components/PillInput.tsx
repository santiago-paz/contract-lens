import { useState } from 'react';

interface PillInputProps {
  value: string[];
  onChange: (val: string[]) => void;
  placeholder?: string;
}

export function PillInput({ value = [], onChange, placeholder }: PillInputProps) {
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const handleCommit = () => {
    if (inputValue.trim()) {
      onChange([...value, inputValue.trim()]);
      setInputValue('');
    }
    setIsTyping(false);
  };

  const handleRemove = (indexToRemove: number) => {
    onChange(value.filter((_, index) => index !== indexToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCommit();
      setIsTyping(true); 
    }
    if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      handleRemove(value.length - 1);
    }
  };

  return (
    <div 
      className="flex flex-wrap gap-2 px-2 py-2 bg-white border border-gray-300 min-h-[42px] focus-within:border-black rounded-sm transition-colors"
      onClick={() => setIsTyping(true)}
    >
      {value.map((pill, index) => (
        <span 
          key={index}
          className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-black border border-gray-200 rounded-sm text-[10px] font-bold uppercase animate-fade-in"
        >
          {pill} 
          <button 
            type="button"
            className="hover:text-red-500 ml-1"
            onClick={(e) => {
              e.stopPropagation();
              handleRemove(index);
            }}
          >
            ×
          </button>
        </span>
      ))}
      
      <input 
        type="text" 
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onBlur={handleCommit}
        onKeyDown={handleKeyDown}
        placeholder={value.length === 0 ? placeholder : ''}
        className="flex-1 bg-transparent outline-none min-w-[50px] text-black placeholder:text-gray-400 text-xs font-medium"
      />
    </div>
  );
}
