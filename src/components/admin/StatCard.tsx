import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  badge?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  isPositive = true,
  icon: Icon,
  iconColor = 'text-primary',
  iconBg = 'bg-cream',
  badge,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-outline-variant p-5 shadow-sm flex flex-col justify-between text-right">
      <div className="flex items-start justify-between gap-3">
        <div className={`w-11 h-11 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center flex-shrink-0`}>
          <Icon size={22} />
        </div>
        {badge && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary text-white">
            {badge}
          </span>
        )}
      </div>

      <div className="mt-4">
        <p className="text-xs text-on-surface-muted font-medium">{title}</p>
        <h3 className="text-2xl font-serif font-bold text-primary mt-1">{value}</h3>
      </div>

      {change && (
        <div className="mt-3 pt-3 border-t border-outline-variant/50 flex items-center gap-1.5 text-xs">
          {isPositive ? (
            <TrendingUp size={14} className="text-emerald-600" />
          ) : (
            <TrendingDown size={14} className="text-red-500" />
          )}
          <span className={`font-semibold ${isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
            {change}
          </span>
          <span className="text-on-surface-muted">عن الشهر السابق</span>
        </div>
      )}
    </div>
  );
};
