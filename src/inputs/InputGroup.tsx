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
      className={cn('tw:flex tw:flex-col tw:gap-md', className)}
      style={styles?.root}
      {...props}
    >
      <h3
        className="tw:text-xs tw:font-semibold tw:uppercase tw:tracking-wider tw:text-text-secondary"
        style={styles?.label}
      >
        {label}
      </h3>
      <div className="tw:flex tw:flex-col tw:gap-sm">{children}</div>
    </div>
  ),
);
InputGroup.displayName = 'InputGroup';
