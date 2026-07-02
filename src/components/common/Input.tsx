import type { InputHTMLAttributes } from 'react';

type Props = InputHTMLAttributes<HTMLInputElement> & { label?: string };

export function Input({ label, className = '', ...props }: Props) {
  return (
    <label className="block">
      {label && <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>}
      <input
        className={`h-10 w-full rounded-md border border-line bg-white px-3 text-sm text-ink outline-none transition placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-blue-100 ${className}`}
        {...props}
      />
    </label>
  );
}
