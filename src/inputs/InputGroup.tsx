import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../utils/cn';

export interface InputGroupProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  styles?: {
    root?: React.CSSProperties;
    label?: React.CSSProperties;
  };
}

export const InputGroup = forwardRef<HTMLDivElement, InputGroupProps>(
  ({ label, className, styles, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col gap-pe-md', className)}
      style={styles?.root}
      {...props}
    >
      <h3
        className="text-xs font-semibold uppercase tracking-wider text-pe-text-secondary"
        style={styles?.label}
      >
        {label}
      </h3>
      <div className="flex flex-col gap-pe-sm">{children}</div>
    </div>
  ),
);
InputGroup.displayName = 'InputGroup';
