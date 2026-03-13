import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../utils/cn';

const sizeMap = {
  xs: 'max-w-screen-xs',
  sm: 'max-w-screen-sm',
  md: 'max-w-screen-md',
  lg: 'max-w-screen-lg',
  xl: 'max-w-screen-xl',
  '2xl': 'max-w-screen-2xl',
} as const;

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: keyof typeof sizeMap;
  variant?: 'guttered';
  styles?: { root?: React.CSSProperties };
}

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size, variant, styles, children, style, ...props }, ref) => {
    // spacing.container['2xl'] = 80px, spacing.container.lg = 48px
    const gutteredStyle =
      variant === 'guttered'
        ? {
            paddingLeft: '80px',
            paddingRight: '80px',
            paddingTop: '48px',
            paddingBottom: '48px',
          }
        : undefined;

    return (
      <div
        ref={ref}
        className={cn(
          'mx-auto w-full',
          variant !== 'guttered' && 'px-4',
          size ? sizeMap[size] : 'max-w-[976px]',
          className,
        )}
        style={{ ...gutteredStyle, ...styles?.root, ...style }}
        {...props}
      >
        {children}
      </div>
    );
  },
);
Container.displayName = 'Container';
