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
      className={cn('flex flex-col md:flex-row min-h-screen', className)}
      style={styles?.root}
      {...props}
    >
      <aside
        className="w-full md:flex-shrink-0 border-r border-border bg-background overflow-y-auto"
        style={{ ...styles?.sidebar, maxWidth: sidebarWidth }}
      >
        {sidebar}
      </aside>
      <main
        className="flex-1 overflow-y-auto"
        style={styles?.content}
      >
        {children}
      </main>
    </div>
  ),
);
SidebarLayout.displayName = 'SidebarLayout';
