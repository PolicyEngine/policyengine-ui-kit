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
      className={cn('flex flex-col gap-4 p-4', className)}
      style={styles?.root}
      {...props}
    >
      {title && (
        <h2
          className="text-lg font-semibold text-foreground"
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
