import { type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../utils/cn';

export interface ChartContainerProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  styles?: {
    root?: React.CSSProperties;
    title?: React.CSSProperties;
    content?: React.CSSProperties;
  };
}

export function ChartContainer({
  title,
  subtitle,
  actions,
  className,
  styles,
  children,
  ...props
}: ChartContainerProps) {
  return (
    <div
      className={cn(
        'tw:bg-white tw:border tw:border-border-light tw:rounded-container tw:p-lg',
        className,
      )}
      style={styles?.root}
      {...props}
    >
      {(title || actions) && (
        <div className="tw:flex tw:items-start tw:justify-between tw:mb-lg">
          <div>
            {title && (
              <h3
                className="tw:text-base tw:font-semibold tw:text-text-primary"
                style={styles?.title}
              >
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="tw:text-sm tw:text-text-secondary tw:mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          {actions}
        </div>
      )}
      <div style={styles?.content}>{children}</div>
    </div>
  );
}
