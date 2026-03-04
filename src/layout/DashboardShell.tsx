import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../utils/cn';

export interface DashboardShellProps extends HTMLAttributes<HTMLDivElement> {
  styles?: { root?: React.CSSProperties };
}

export const DashboardShell = forwardRef<HTMLDivElement, DashboardShellProps>(
  ({ className, styles, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'min-h-screen bg-pe-bg-secondary font-sans text-pe-text-primary',
        className,
      )}
      style={styles?.root}
      {...props}
    >
      {children}
    </div>
  ),
);
DashboardShell.displayName = 'DashboardShell';
