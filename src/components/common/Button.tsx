import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  icon?: ReactNode;
};

const variants = {
  primary: 'bg-primary text-white hover:bg-blue-700 border-primary',
  secondary: 'bg-white text-ink hover:bg-gray-50 border-line',
  ghost: 'bg-transparent text-muted hover:bg-gray-100 border-transparent',
  danger: 'bg-white text-danger hover:bg-red-50 border-red-100',
};

export function Button({ className = '', variant = 'secondary', icon, children, ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex h-9 items-center justify-center gap-2 rounded-md border px-3 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
