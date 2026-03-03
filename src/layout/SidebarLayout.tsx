import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../utils/cn';

export interface SidebarLayoutProps extends HTMLAttributes<HTMLDivElement> {
  sidebar: ReactNode;
  sidebarWidth?: string;
  styles?: {
    root?: React.CSSProperties;
    sidebar?: React.CSSProperties;
    content?: React.CSSProperties;
  };
}

export const SidebarLayout = forwardRef<HTMLDivElement, SidebarLayoutProps>(
  ({ sidebar, sidebarWidth = '320px', className, styles, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('tw:flex tw:flex-col tw:md:flex-row tw:min-h-screen', className)}
      style={styles?.root}
      {...props}
    >
      <aside
        className="tw:w-full tw:md:flex-shrink-0 tw:border-r tw:border-border-light tw:bg-white tw:overflow-y-auto"
        style={{ ...styles?.sidebar, maxWidth: sidebarWidth }}
      >
        {sidebar}
      </aside>
      <main
        className="tw:flex-1 tw:overflow-y-auto"
        style={styles?.content}
      >
        {children}
      </main>
    </div>
  ),
);
SidebarLayout.displayName = 'SidebarLayout';
