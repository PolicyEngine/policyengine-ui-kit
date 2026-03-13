import * as React from 'react';
import { cn } from '../utils/cn';

interface SidebarDividerProps {
  className?: string;
}

const SidebarDivider = React.forwardRef<HTMLHRElement, SidebarDividerProps>(
  ({ className }, ref) => {
    return (
      <hr
        ref={ref}
        className={cn('mx-4 border-border-light', className)}
      />
    );
  },
);

SidebarDivider.displayName = 'SidebarDivider';

export { SidebarDivider };
export type { SidebarDividerProps };
