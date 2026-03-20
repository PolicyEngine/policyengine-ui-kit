import React, { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils/cn';

// Mantine color aliases -- "dimmed" was the most common
const COLOR_ALIASES: Record<string, string> = {
  dimmed: 'var(--muted-foreground)',
};

const textVariants = cva('', {
  variants: {
    size: {
      xs: 'text-xs',
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
    },
    weight: {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export interface TextProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof textVariants> {
  span?: boolean;
  fw?: number;
  c?: string;
  component?: React.ElementType;
  styles?: { root?: React.CSSProperties };
}

export const Text = forwardRef<HTMLElement, TextProps>(
  (
    { className, size, weight, span, fw, c, component, style, styles, children, ...props },
    ref,
  ) => {
    const Component = component || (span ? 'span' : 'p');
    const fontWeightStyle = fw ? { fontWeight: fw } : undefined;
    const colorStyle = c ? { color: COLOR_ALIASES[c] || c } : undefined;

    return (
      <Component
        ref={ref}
        className={cn(textVariants({ size, weight }), className)}
        style={{ ...fontWeightStyle, ...colorStyle, ...styles?.root, ...style }}
        {...props}
      >
        {children}
      </Component>
    );
  },
);
Text.displayName = 'Text';

export { textVariants };
