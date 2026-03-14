import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../utils/cn';

const headerVariants = cva(
  'flex items-center justify-between h-[58px] px-6',
  {
    variants: {
      variant: {
        light: 'bg-background border-b border-border',
        dark: 'bg-teal-600 text-white shadow-md border-b border-gray-400',
      },
    },
    defaultVariants: { variant: 'light' },
  },
);

const actionsVariants = cva(
  'flex items-center gap-8',
  {
    variants: {
      variant: {
        light:
          '[&_a]:text-muted-foreground [&_a]:text-lg [&_a]:font-medium [&_a]:no-underline [&_a]:hover:text-foreground',
        dark:
          '[&_a]:text-white [&_a]:text-lg [&_a]:font-medium [&_a]:no-underline [&_a]:hover:opacity-80',
      },
    },
    defaultVariants: { variant: 'light' },
  },
);

const subtitleVariants = cva(
  'flex items-center gap-3',
  {
    variants: {
      variant: {
        light: '[&>span]:text-muted-foreground [&>span]:text-lg [&>span]:font-medium',
        dark: '[&>span]:text-white/70 [&>span]:text-lg [&>span]:font-medium',
      },
    },
    defaultVariants: { variant: 'light' },
  },
);

export interface HeaderNavLink {
  /** Display text */
  text: string;
  /** URL slug for identification (e.g., "research") */
  slug: string;
  /** Where to navigate — a full URL (external) or a path (internal) */
  href: string;
}

export interface HeaderProps
  extends HTMLAttributes<HTMLElement>,
    VariantProps<typeof headerVariants> {
  logo?: ReactNode;
  /** Structured navigation links rendered in the actions area */
  navLinks?: HeaderNavLink[];
  /** Additional actions rendered after navLinks (e.g., sign-in button) */
  actions?: ReactNode;
  styles?: { root?: React.CSSProperties };
}

export const Header = forwardRef<HTMLElement, HeaderProps>(
  ({ logo, navLinks, actions, variant, className, styles, children, ...props }, ref) => (
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
      {(navLinks || actions) && (
        <nav className={cn(actionsVariants({ variant }))}>
          {navLinks?.map((link) => (
            <a key={link.slug} href={link.href}>
              {link.text}
            </a>
          ))}
          {actions}
        </nav>
      )}
    </header>
  ),
);
Header.displayName = 'Header';

export { headerVariants };
