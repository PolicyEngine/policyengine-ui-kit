import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '../utils/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-sm text-sm font-medium transition-colors cursor-pointer disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground hover:bg-teal-600',
        outline:
          'border border-border bg-background hover:bg-gray-50',
        ghost: 'hover:bg-gray-100',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-red-600',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-10 px-6',
        icon: 'h-9 w-9',
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
