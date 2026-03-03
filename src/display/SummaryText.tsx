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
        'tw:text-base tw:leading-relaxed tw:text-text-primary tw:bg-white tw:border tw:border-border-light tw:rounded-container tw:p-lg',
        className,
      )}
      style={styles?.root}
      {...props}
    >
      {children}
    </div>
  );
}
