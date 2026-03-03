import { type HTMLAttributes } from 'react';
import { cn } from '../utils/cn';

export interface PolicyEngineWatermarkProps extends HTMLAttributes<HTMLDivElement> {
  logoSrc?: string;
  styles?: { root?: React.CSSProperties };
}

export function PolicyEngineWatermark({
  logoSrc,
  className,
  styles,
  ...props
}: PolicyEngineWatermarkProps) {
  return (
    <div
      className={cn(
        'tw:flex tw:items-center tw:justify-end tw:gap-1 tw:py-1 tw:opacity-60',
        className,
      )}
      style={styles?.root}
      {...props}
    >
      {logoSrc && (
        <img src={logoSrc} alt="PolicyEngine" className="tw:h-4 tw:w-4" />
      )}
      <span className="tw:text-xs tw:text-text-tertiary">PolicyEngine</span>
    </div>
  );
}
