import React from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  id?: string;
  name?: string;
}

const Select: React.FC<SelectProps> = ({
  value,
  onChange,
  options,
  placeholder = '请选择',
  className = '',
  id,
  name
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log('Select value changed:', e.target.value);
    onChange(e.target.value);
  };

  return (
    <select
      id={id}
      name={name}
      value={value}
      onChange={handleChange}
      className={`w-full px-3 py-2 rounded-md border border-[#e5e5e5] bg-white text-[#333333] focus:outline-none focus:border-[#007AFF] focus:ring-1 focus:ring-[#007AFF] ${className}`}
      aria-label={placeholder}
    >
      {!value && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select; 