import React from 'react';

interface BadgeProps {
  variant?: 'primary' | 'secondary' | 'sage' | 'outline' | 'warning' | 'danger' | 'success';
  size?: 'sm' | 'md';
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'secondary',
  size = 'md',
  children,
  className = '',
  dot = false,
}) => {
  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 rounded-full tracking-wide',
    md: 'text-xs px-2.5 py-1 rounded-full font-medium',
  };

  const variantStyles = {
    primary: 'bg-primary text-white',
    secondary: 'bg-blush text-primary border border-secondary/30',
    sage: 'bg-tertiary-container text-tertiary-dark border border-tertiary/20',
    outline: 'bg-white text-on-surface-variant border border-outline-variant',
    warning: 'bg-amber-50 text-amber-800 border border-amber-200',
    danger: 'bg-red-50 text-red-700 border border-red-200',
    success: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
  };

  const dotColors = {
    primary: 'bg-white',
    secondary: 'bg-secondary',
    sage: 'bg-tertiary',
    outline: 'bg-outline',
    warning: 'bg-amber-500',
    danger: 'bg-red-500',
    success: 'bg-emerald-500',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 font-medium select-none ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />}
      <span>{children}</span>
    </span>
  );
};
