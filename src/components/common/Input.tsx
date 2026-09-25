import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, icon, className = '', id, required, ...props }, ref) => {
    const inputId = id || (label ? `input-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);

    return (
      <div className="w-full text-start">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold text-primary mb-1.5">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <div className="absolute end-3.5 text-on-surface-muted pointer-events-none flex items-center">
              {icon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            required={required}
            className={`w-full bg-white text-primary text-sm px-4 py-3 rounded-lg border transition-all duration-200 placeholder:text-on-surface-muted/60 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary ${
              icon ? 'pe-11' : ''
            } ${
              error
                ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                : 'border-outline-variant hover:border-outline'
            } ${className}`}
            {...props}
          />
        </div>
        {error && <p className="mt-1 text-xs text-red-600 font-medium">{error}</p>}
        {helperText && !error && <p className="mt-1 text-xs text-on-surface-muted">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
