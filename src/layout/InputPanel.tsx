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
      className={cn('flex flex-col gap-pe-lg p-pe-lg', className)}
      style={styles?.root}
      {...props}
    >
      {title && (
        <h2
          className="text-lg font-semibold text-pe-text-primary"
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
