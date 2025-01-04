import React from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  className?: string;
}

const Select: React.FC<SelectProps> = ({
  id,
  value,
  onChange,
  options,
  className
}) => {
  return (
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`
          appearance-none w-full px-4 py-3
          bg-[#f5f5f7] text-[#1d1d1f]
          rounded-xl border-0
          focus:ring-2 focus:ring-[#0071e3]
          cursor-pointer
          transition-all duration-200
          ${className || ''}
        `}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg 
          className="w-4 h-4 text-[#86868b]" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M19 9l-7 7-7-7" 
          />
        </svg>
      </div>
    </div>
  );
};

export default Select; 