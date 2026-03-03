import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../utils/cn';

export interface HeaderProps extends HTMLAttributes<HTMLElement> {
  logo?: ReactNode;
  actions?: ReactNode;
  styles?: { root?: React.CSSProperties };
}

export const Header = forwardRef<HTMLElement, HeaderProps>(
  ({ logo, actions, className, styles, children, ...props }, ref) => (
    <header
      ref={ref}
      className={cn(
        'tw:flex tw:items-center tw:justify-between tw:h-[58px] tw:px-lg tw:border-b tw:border-border-light tw:bg-white',
        className,
      )}
      style={styles?.root}
      {...props}
    >
      <div className="tw:flex tw:items-center tw:gap-md">
        {logo}
        {children}
      </div>
      {actions && <div className="tw:flex tw:items-center tw:gap-sm">{actions}</div>}
    </header>
  ),
);
Header.displayName = 'Header';
