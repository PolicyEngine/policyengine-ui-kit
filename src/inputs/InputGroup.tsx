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
      className={cn('flex flex-col gap-3', className)}
      style={styles?.root}
      {...props}
    >
      <h3
        className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
        style={styles?.label}
      >
        {label}
      </h3>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  ),
);
InputGroup.displayName = 'InputGroup';
