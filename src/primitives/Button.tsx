import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { Slot } from 'radix-ui';
import { cn } from '../utils/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all cursor-pointer disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=size-])]:size-4 shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground hover:bg-primary/90',
        outline:
          'border border-border bg-background hover:bg-gray-50',
        ghost: 'bg-transparent hover:bg-gray-100',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-red-600',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        link: 'bg-transparent text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        xs: 'h-6 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*=size-])]:size-3',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-10 px-6',
        icon: 'h-9 w-9',
        'icon-xs': 'size-6 rounded-md [&_svg:not([class*=size-])]:size-3',
        'icon-sm': 'size-8',
        'icon-lg': 'size-10',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  styles?: { root?: React.CSSProperties };
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', styles, asChild = false, ...props }, ref) => {
    const Comp = (asChild ? Slot.Root : 'button') as React.ElementType;

    return (
      <Comp
        ref={ref}
        data-slot="button"
        data-variant={variant}
        data-size={size}
        className={cn(buttonVariants({ variant, size }), className)}
        style={styles?.root}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { buttonVariants };
