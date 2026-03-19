import React, { forwardRef } from 'react';
import { cn } from '../utils/cn';

const sizeMap = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
} as const;

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: keyof typeof sizeMap;
  styles?: { root?: React.CSSProperties };
}

export const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size = 'md', styles, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="status"
        className={cn(
          'animate-spin rounded-full border-2 border-current border-t-transparent text-primary',
          sizeMap[size],
          className,
        )}
        style={styles?.root}
        {...props}
      >
        <span className="sr-only">Loading...</span>
      </div>
    );
  },
);
Spinner.displayName = 'Spinner';
