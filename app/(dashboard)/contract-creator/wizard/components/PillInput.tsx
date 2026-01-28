import { useState } from 'react';

interface PillInputProps {
  value: string | null | undefined;
  onChange: (val: string | null) => void;
  placeholder?: string;
}

export function PillInput({ value, onChange, placeholder }: PillInputProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value || '');

  const handleStartEdit = () => {
    setTempValue(value || '');
    setIsEditing(true);
  };

  const handleCommit = () => {
    setIsEditing(false);
    if (tempValue.trim()) {
      onChange(tempValue.trim());
    } else {
      onChange(null);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
  };

  if (value && !isEditing) {
    return (
      <div className="flex flex-wrap gap-2 mb-2">
        <span 
          className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs cursor-pointer hover:bg-blue-100 transition-colors"
          onClick={handleStartEdit}
          title="Click to edit"
        >
          {value} 
          <button 
            className="hover:text-blue-900 p-0.5 rounded-full hover:bg-blue-200 transition-colors"
            onClick={handleRemove}
          >
            ×
          </button>
        </span>
      </div>
    );
  }

  return (
    <input 
      type="text" 
      value={tempValue}
      onChange={(e) => setTempValue(e.target.value)}
      onBlur={handleCommit}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleCommit();
        }
      }}
      placeholder={placeholder}
      autoFocus={isEditing}
      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none mb-2"
    />
  );
}
