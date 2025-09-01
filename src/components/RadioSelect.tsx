// components/common/RadioPill.tsx
import React from 'react';

type RadioValue = string | number;

export interface RadioSelectProps {
  name: string; 
  value: RadioValue; 
  checkedValue?: RadioValue;
  onChange?: (v: RadioValue) => void;
  label: React.ReactNode; 
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg'; 
}

export default function RadioSelect({
  name,
  value,
  checkedValue,
  onChange,
  label,
  disabled,
  className = '',
  size = 'md',
}: RadioSelectProps) {
  const checked = checkedValue === value;
  const id = `${name}-${String(value)}`;

  const sizeCls =
    size === 'lg'
      ? 'h-12 px-6 text-[17px]'
      : size === 'sm'
      ? 'h-9 px-4 text-[14px]'
      : 'h-10 px-5 text-[15px]';

  const colorCls = checked
    ? 'bg-[#5691ff] text-white '
    : 'bg-white/50 text-slate-600 border-slate-300 hover:border-slate-400';

  const base = `inline-flex items-center gap-1 rounded-full border transition-colors duration-200 select-none ${sizeCls} ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'} ${className}`;

  return (
    <label
      htmlFor={id}
      className={`${base} ${colorCls} ${className}`}>
      <input
        id={id}
        type='radio'
        name={name}
        value={String(value)}
        checked={checked}
        onChange={() => onChange?.(value)}
        disabled={disabled}
        className='sr-only'
      />
      <svg
        viewBox='0 0 24 24'
        className={checked ? 'h-5 w-5 text-white' : 'h-5 w-5 text-slate-300'}
        fill='none'
        stroke='currentColor'
        strokeWidth='3'>
        <path d='M5 13l4 4L19 7' />
      </svg>
      <span className='font-semibold leading-none pr-1 '>{label}</span>
    </label>
  );
}
