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

const justifyMap = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  'space-between': 'justify-between',
  apart: 'justify-between',
} as const;

const alignMap = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
  baseline: 'items-baseline',
} as const;

export interface GroupProps extends HTMLAttributes<HTMLDivElement> {
  gap?: keyof typeof gapMap;
  justify?: keyof typeof justifyMap;
  align?: keyof typeof alignMap;
  wrap?: 'wrap' | 'nowrap';
  grow?: boolean;
  styles?: { root?: React.CSSProperties };
}

export const Group = forwardRef<HTMLDivElement, GroupProps>(
  (
    { className, gap = 'md', justify, align = 'center', wrap = 'wrap', grow, styles, children, ...props },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-row',
          gapMap[gap],
          justifyMap[justify ?? 'start'],
          alignMap[align],
          wrap === 'wrap' ? 'flex-wrap' : 'flex-nowrap',
          grow && '[&>*]:flex-1',
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
Group.displayName = 'Group';
