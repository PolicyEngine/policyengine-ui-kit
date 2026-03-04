import { type HTMLAttributes } from 'react';
import { cn } from '../utils/cn';

export interface SummaryTextProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  styles?: { root?: React.CSSProperties };
}

export function SummaryText({ className, styles, children, ...props }: SummaryTextProps) {
  return (
    <div
      className={cn(
        'text-base leading-relaxed text-pe-text-primary bg-white border border-pe-border-light rounded-pe-container p-pe-lg',
        className,
      )}
      style={styles?.root}
      {...props}
    >
      {children}
    </div>
  );
}
