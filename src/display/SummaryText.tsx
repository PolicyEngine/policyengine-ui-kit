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
        'text-base leading-relaxed text-foreground bg-card border border-border rounded-lg p-4',
        className,
      )}
      style={styles?.root}
      {...props}
    >
      {children}
    </div>
  );
}
