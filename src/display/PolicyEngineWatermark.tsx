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
        'flex items-center justify-end gap-1 py-1 opacity-60',
        className,
      )}
      style={styles?.root}
      {...props}
    >
      {logoSrc && (
        <img src={logoSrc} alt="PolicyEngine" className="h-4 w-4" />
      )}
      <span className="text-xs text-gray-400">PolicyEngine</span>
    </div>
  );
}
