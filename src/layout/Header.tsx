import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../utils/cn';

const headerVariants = cva(
  'flex items-center justify-between h-[58px] px-pe-2xl',
  {
    variants: {
      variant: {
        light: 'bg-white border-b border-pe-border-light',
        dark: 'bg-pe-primary-600 text-white shadow-md border-b border-pe-border-dark',
      },
    },
    defaultVariants: { variant: 'light' },
  },
);

const actionsVariants = cva(
  'flex items-center gap-pe-3xl',
  {
    variants: {
      variant: {
        light:
          '[&_a]:text-pe-text-secondary [&_a]:text-lg [&_a]:font-medium [&_a]:no-underline [&_a]:hover:text-pe-text-primary',
        dark:
          '[&_a]:text-white [&_a]:text-lg [&_a]:font-medium [&_a]:no-underline [&_a]:hover:opacity-80',
      },
    },
    defaultVariants: { variant: 'light' },
  },
);

const subtitleVariants = cva(
  'flex items-center gap-pe-md',
  {
    variants: {
      variant: {
        light: '[&>span]:text-pe-text-secondary [&>span]:text-lg [&>span]:font-medium',
        dark: '[&>span]:text-white/70 [&>span]:text-lg [&>span]:font-medium',
      },
    },
    defaultVariants: { variant: 'light' },
  },
);

export interface HeaderProps
  extends HTMLAttributes<HTMLElement>,
    VariantProps<typeof headerVariants> {
  logo?: ReactNode;
  actions?: ReactNode;
  styles?: { root?: React.CSSProperties };
}

export const Header = forwardRef<HTMLElement, HeaderProps>(
  ({ logo, actions, variant, className, styles, children, ...props }, ref) => (
    <header
      ref={ref}
      className={cn(headerVariants({ variant }), className)}
      style={styles?.root}
      {...props}
    >
      <div className={cn(subtitleVariants({ variant }))}>
        {logo}
        {children}
      </div>
      {actions && (
        <div className={cn(actionsVariants({ variant }))}>
          {actions}
        </div>
      )}
    </header>
  ),
);
Header.displayName = 'Header';

export { headerVariants };
