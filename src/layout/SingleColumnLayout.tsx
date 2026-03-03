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
      className={cn('tw:min-h-screen tw:bg-bg-secondary', className)}
      style={styles?.root}
      {...props}
    >
      <div
        className="tw:mx-auto tw:px-lg tw:py-2xl"
        style={{ maxWidth, ...styles?.content }}
      >
        {children}
      </div>
    </div>
  ),
);
SingleColumnLayout.displayName = 'SingleColumnLayout';
