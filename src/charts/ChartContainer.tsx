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
        'bg-card border border-border rounded-lg p-4',
        className,
      )}
      style={styles?.root}
      {...props}
    >
      {(title || actions) && (
        <div className="flex items-start justify-between mb-4">
          <div>
            {title && (
              <h3
                className="text-base font-semibold text-foreground"
                style={styles?.title}
              >
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-sm text-muted-foreground mt-0.5">
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
