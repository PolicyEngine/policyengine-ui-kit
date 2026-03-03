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
        'tw:bg-white tw:border tw:border-border-light tw:rounded-container tw:p-lg tw:flex tw:flex-col tw:gap-xs',
        className,
      )}
      style={styles?.root}
      {...props}
    >
      <span
        className="tw:text-sm tw:text-text-secondary tw:font-medium"
        style={styles?.label}
      >
        {label}
      </span>
      <span
        className="tw:text-2xl tw:font-bold tw:text-text-primary"
        style={styles?.value}
      >
        {typeof value === 'number' ? formatByType(value, format) : value}
      </span>
      {trend && delta && (
        <span
          className={cn(
            'tw:text-sm tw:font-medium',
            trend === 'positive' && 'tw:text-primary-500',
            trend === 'negative' && 'tw:text-error',
            trend === 'neutral' && 'tw:text-gray-500',
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
