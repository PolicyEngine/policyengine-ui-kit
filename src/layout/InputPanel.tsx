import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../utils/cn';

export interface InputPanelProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  styles?: { root?: React.CSSProperties; title?: React.CSSProperties };
}

export const InputPanel = forwardRef<HTMLDivElement, InputPanelProps>(
  ({ title, className, styles, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('tw:flex tw:flex-col tw:gap-lg tw:p-lg', className)}
      style={styles?.root}
      {...props}
    >
      {title && (
        <h2
          className="tw:text-lg tw:font-semibold tw:text-text-primary"
          style={styles?.title}
        >
          {title}
        </h2>
      )}
      {children}
    </div>
  ),
);
InputPanel.displayName = 'InputPanel';
