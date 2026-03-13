import * as React from 'react';
import { cn } from '../utils/cn';

interface SidebarSectionProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const SidebarSection = React.forwardRef<HTMLDivElement, SidebarSectionProps>(
  ({ title, children, className }, ref) => {
    return (
      <div ref={ref} className={cn('flex flex-col gap-1 px-2 py-2', className)}>
        {title && (
          <span className="px-3 pb-1 text-xs leading-normal font-medium text-muted-foreground">
            {title}
          </span>
        )}
        <div className="flex flex-col gap-0.5">{children}</div>
      </div>
    );
  },
);

SidebarSection.displayName = 'SidebarSection';

export { SidebarSection };
export type { SidebarSectionProps };
