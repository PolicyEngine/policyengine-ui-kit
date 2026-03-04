import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../utils/cn';

export interface SingleColumnLayoutProps extends HTMLAttributes<HTMLDivElement> {
  maxWidth?: string;
  styles?: { root?: React.CSSProperties; content?: React.CSSProperties };
}

export const SingleColumnLayout = forwardRef<HTMLDivElement, SingleColumnLayoutProps>(
  ({ maxWidth = '976px', className, styles, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('min-h-screen bg-pe-bg-secondary', className)}
      style={styles?.root}
      {...props}
    >
      <div
        className="mx-auto px-pe-lg py-pe-2xl"
        style={{ maxWidth, ...styles?.content }}
      >
        {children}
      </div>
    </div>
  ),
);
SingleColumnLayout.displayName = 'SingleColumnLayout';
