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
      // Keep typing focus if desired, or maybe not. 
      // Usually pill inputs let you keep adding.
      // We'll set isTyping true again effectively by focusing the input or keeping it rendered
      setIsTyping(true); 
    }
    if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      // Remove last tag if backspace pressed with empty input
      handleRemove(value.length - 1);
    }
  };

  return (
    <div 
      className="flex flex-wrap gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent min-h-[42px]"
      onClick={() => setIsTyping(true)}
    >
      {value.map((pill, index) => (
        <span 
          key={index}
          className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs animate-fade-in"
        >
          {pill} 
          <button 
            type="button"
            className="hover:text-blue-900 p-0.5 rounded-full hover:bg-blue-200 transition-colors"
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
        className="flex-1 bg-transparent outline-none min-w-[100px] text-gray-900 placeholder:text-gray-400"
      />
    </div>
  );
}
