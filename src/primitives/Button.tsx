import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '../utils/cn';

const buttonVariants = cva(
  'tw:inline-flex tw:items-center tw:justify-center tw:gap-2 tw:rounded-element tw:text-sm tw:font-medium tw:transition-colors tw:cursor-pointer tw:disabled:pointer-events-none tw:disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'tw:bg-primary tw:text-primary-foreground tw:hover:bg-primary-600',
        outline:
          'tw:border tw:border-border-light tw:bg-white tw:hover:bg-gray-50',
        ghost: 'tw:hover:bg-gray-100',
        destructive: 'tw:bg-error tw:text-white tw:hover:bg-red-600',
      },
      size: {
        default: 'tw:h-9 tw:px-4 tw:py-2',
        sm: 'tw:h-8 tw:px-3 tw:text-xs',
        lg: 'tw:h-10 tw:px-6',
        icon: 'tw:h-9 tw:w-9',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  styles?: { root?: React.CSSProperties };
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, styles, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      style={styles?.root}
      {...props}
    />
  ),
);
Button.displayName = 'Button';

export { buttonVariants };
