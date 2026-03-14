import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../utils/cn';

const gapMap = {
  xs: 'gap-1',
  sm: 'gap-2',
  md: 'gap-3',
  lg: 'gap-4',
  xl: 'gap-5',
  '2xl': 'gap-6',
  '3xl': 'gap-8',
  '4xl': 'gap-12',
  '5xl': 'gap-16',
} as const;

const alignMap = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
} as const;

const justifyMap = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  'space-between': 'justify-between',
  'space-around': 'justify-around',
} as const;

export interface StackProps extends HTMLAttributes<HTMLDivElement> {
  gap?: keyof typeof gapMap;
  align?: keyof typeof alignMap;
  justify?: keyof typeof justifyMap;
  styles?: { root?: React.CSSProperties };
}

export const Stack = forwardRef<HTMLDivElement, StackProps>(
  ({ className, gap = 'md', align, justify, styles, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col',
          gapMap[gap],
          align && alignMap[align],
          justify && justifyMap[justify],
          className,
        )}
        style={styles?.root}
        {...props}
      >
        {children}
      </div>
    );
  },
);
Stack.displayName = 'Stack';
