import { type HTMLAttributes } from 'react';
import { cn } from '../utils/cn';
import { formatCurrency, formatPercent, formatNumber } from '../tokens/charts';

export type MetricFormat = 'currency' | 'percent' | 'number' | 'string';
export type MetricTrend = 'positive' | 'negative' | 'neutral';

export interface MetricCardProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  value: number | string;
  format?: MetricFormat;
  trend?: MetricTrend;
  delta?: string;
  styles?: {
    root?: React.CSSProperties;
    label?: React.CSSProperties;
    value?: React.CSSProperties;
    trend?: React.CSSProperties;
  };
}

function formatByType(value: number, format: MetricFormat): string {
  switch (format) {
    case 'currency':
      return formatCurrency(value);
    case 'percent':
      return formatPercent(value, 1);
    case 'number':
      return formatNumber(value);
    default:
      return String(value);
  }
}

export function MetricCard({
  label,
  value,
  format = 'string',
  trend,
  delta,
  className,
  styles,
  ...props
}: MetricCardProps) {
  return (
    <div
      className={cn(
        'bg-white border border-pe-border-light rounded-pe-container p-pe-lg flex flex-col gap-pe-xs',
        className,
      )}
      style={styles?.root}
      {...props}
    >
      <span
        className="text-sm text-pe-text-secondary font-medium"
        style={styles?.label}
      >
        {label}
      </span>
      <span
        className="text-2xl font-bold text-pe-text-primary"
        style={styles?.value}
      >
        {typeof value === 'number' ? formatByType(value, format) : value}
      </span>
      {trend && delta && (
        <span
          className={cn(
            'text-sm font-medium',
            trend === 'positive' && 'text-pe-primary-500',
            trend === 'negative' && 'text-pe-error',
            trend === 'neutral' && 'text-pe-gray-500',
          )}
          style={styles?.trend}
        >
          {trend === 'positive' && '\u2191 '}
          {trend === 'negative' && '\u2193 '}
          {delta}
        </span>
      )}
    </div>
  );
}
