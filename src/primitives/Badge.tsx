import { cva, type VariantProps } from 'class-variance-authority';
import { type HTMLAttributes } from 'react';
import { cn } from '../utils/cn';

const badgeVariants = cva(
  'tw:inline-flex tw:items-center tw:rounded-chip tw:px-3 tw:py-1 tw:text-xs tw:font-medium tw:transition-colors',
  {
    variants: {
      variant: {
        default: 'tw:bg-primary tw:text-primary-foreground',
        secondary: 'tw:bg-secondary tw:text-secondary-foreground',
        outline: 'tw:border tw:border-border-light tw:text-text-primary',
        success: 'tw:bg-green-100 tw:text-green-800',
        warning: 'tw:bg-yellow-100 tw:text-yellow-800',
        error: 'tw:bg-red-100 tw:text-red-800',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  styles?: { root?: React.CSSProperties };
}

export function Badge({ className, variant, styles, ...props }: BadgeProps) {
  return (
    <span
      className={cn(badgeVariants({ variant }), className)}
      style={styles?.root}
      {...props}
    />
  );
}

export { badgeVariants };
