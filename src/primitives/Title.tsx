import React, { forwardRef } from 'react';
import { cn } from '../utils/cn';

const orderStyles = {
  1: 'text-4xl font-bold',
  2: 'text-3xl font-bold',
  3: 'text-2xl font-semibold',
  4: 'text-xl font-semibold',
  5: 'text-lg font-medium',
  6: 'text-base font-medium',
} as const;

export interface TitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  order?: 1 | 2 | 3 | 4 | 5 | 6;
  styles?: { root?: React.CSSProperties };
}

export const Title = forwardRef<HTMLHeadingElement, TitleProps>(
  ({ className, order = 1, styles, children, ...props }, ref) => {
    const Component = `h${order}` as const;

    return (
      <Component
        ref={ref as React.Ref<HTMLHeadingElement>}
        className={cn(orderStyles[order], className)}
        style={styles?.root}
        {...props}
      >
        {children}
      </Component>
    );
  },
);
Title.displayName = 'Title';
