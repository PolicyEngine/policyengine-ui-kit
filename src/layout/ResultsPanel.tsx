import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../utils/cn';

export interface ResultsPanelProps extends HTMLAttributes<HTMLDivElement> {
  styles?: { root?: React.CSSProperties };
}

export const ResultsPanel = forwardRef<HTMLDivElement, ResultsPanelProps>(
  ({ className, styles, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'tw:flex tw:flex-col tw:gap-2xl tw:p-2xl',
        className,
      )}
      style={styles?.root}
      {...props}
    >
      {children}
    </div>
  ),
);
ResultsPanel.displayName = 'ResultsPanel';
