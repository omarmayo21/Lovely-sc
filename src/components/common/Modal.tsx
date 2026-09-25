import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '../../i18n';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'md',
}) => {
  const { dir } = useLanguage();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const maxWidthStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm animate-fade-in">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={`relative w-full ${maxWidthStyles[maxWidth]} bg-white rounded-2xl shadow-2xl border border-outline-variant p-6 z-10 overflow-hidden max-h-[90vh] flex flex-col text-start`}
        dir={dir}
      >
        <div className="flex items-center justify-between pb-4 border-b border-outline-variant/60">
          <h3 className="text-lg font-serif font-semibold text-primary">{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 text-on-surface-muted hover:text-primary hover:bg-surface-container-low rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        <div className="py-4 overflow-y-auto custom-scrollbar flex-1">{children}</div>
      </div>
    </div>
  );
};
