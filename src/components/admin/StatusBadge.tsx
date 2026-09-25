import React from 'react';
import { OrderStatus } from '../../types';

interface StatusBadgeProps {
  status: OrderStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusConfig: Record<OrderStatus, { label: string; className: string; dotColor: string }> = {
    pending: {
      label: 'قيد الانتظار',
      className: 'bg-amber-50 text-amber-800 border-amber-200',
      dotColor: 'bg-amber-500',
    },
    processing: {
      label: 'جاري التجهيز',
      className: 'bg-blue-50 text-blue-800 border-blue-200',
      dotColor: 'bg-blue-500',
    },
    shipped: {
      label: 'تم الشحن',
      className: 'bg-purple-50 text-purple-800 border-purple-200',
      dotColor: 'bg-purple-500',
    },
    delivered: {
      label: 'تم التوصيل',
      className: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      dotColor: 'bg-emerald-500',
    },
    cancelled: {
      label: 'ملغي',
      className: 'bg-red-50 text-red-800 border-red-200',
      dotColor: 'bg-red-500',
    },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border select-none ${config.className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`} />
      <span>{config.label}</span>
    </span>
  );
};
