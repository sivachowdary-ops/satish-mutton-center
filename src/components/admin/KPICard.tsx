import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function KPICard({ title, value, icon: Icon, trend, className = '' }: KPICardProps) {
  return (
    <div className={`bg-surface-card rounded-2xl p-6 shadow-sm border border-surface-muted flex flex-col gap-4 ${className}`}>
      <div className="flex justify-between items-start">
        <p className="text-ink-muted font-medium text-sm">{title}</p>
        <div className="p-2 bg-brand/10 rounded-lg text-brand">
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <h3 className="text-2xl font-bold text-ink">{value}</h3>
        {trend && (
          <span className={`text-sm font-medium ${trend.isPositive ? 'text-success' : 'text-danger'}`}>
            {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
          </span>
        )}
      </div>
    </div>
  );
}
