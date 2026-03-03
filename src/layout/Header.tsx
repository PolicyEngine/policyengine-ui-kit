import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../utils/cn';

const headerVariants = cva(
  'tw:flex tw:items-center tw:justify-between tw:h-[58px] tw:px-2xl',
  {
    variants: {
      variant: {
        light: 'tw:bg-white tw:border-b tw:border-border-light',
        dark: 'tw:bg-primary-600 tw:text-white tw:shadow-md tw:border-b tw:border-border-dark',
      },
    },
    defaultVariants: { variant: 'light' },
  },
);

const actionsVariants = cva(
  'tw:flex tw:items-center tw:gap-3xl',
  {
    variants: {
      variant: {
        light:
          '[&_a]:tw:text-text-secondary [&_a]:tw:text-lg [&_a]:tw:font-medium [&_a]:tw:no-underline [&_a]:tw:hover:text-text-primary [&_button]:tw:text-text-secondary',
        dark:
          '[&_a]:tw:text-white [&_a]:tw:text-lg [&_a]:tw:font-medium [&_a]:tw:no-underline [&_a]:tw:hover:opacity-80 [&_button]:tw:text-white',
      },
    },
    defaultVariants: { variant: 'light' },
  },
);

const subtitleVariants = cva(
  'tw:flex tw:items-center tw:gap-md',
  {
    variants: {
      variant: {
        light: '[&>span]:tw:text-text-secondary [&>span]:tw:text-lg [&>span]:tw:font-medium',
        dark: '[&>span]:tw:text-white/70 [&>span]:tw:text-lg [&>span]:tw:font-medium',
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
