import { type HTMLAttributes } from 'react';
import { cn } from '../utils/cn';
import { logos } from '../assets';

export interface PolicyEngineWatermarkProps extends HTMLAttributes<HTMLDivElement> {
  /** Override the default teal wordmark PNG */
  logoSrc?: string;
  /** Logo width in px (default 80) */
  width?: number;
  /** Opacity 0–1 (default 0.8) */
  opacity?: number;
  /** Horizontal alignment (default "right") */
  align?: 'left' | 'center' | 'right';
  styles?: { root?: React.CSSProperties };
}

/**
 * PolicyEngine logo watermark for charts.
 * Mirrors the app-v2 ChartWatermark: right-aligned teal wordmark at 80 px / 0.8 opacity.
 */
export function PolicyEngineWatermark({
  logoSrc,
  width = 80,
  opacity = 0.8,
  align = 'right',
  className,
  styles,
  ...props
}: PolicyEngineWatermarkProps) {
  return (
    <div
      className={cn(
        'flex',
        align === 'left'
          ? 'justify-start'
          : align === 'center'
            ? 'justify-center'
            : 'justify-end',
        className,
      )}
      style={styles?.root}
      {...props}
    >
      <img
        src={logoSrc ?? logos.tealWordmarkPng}
        alt=""
        style={{
          display: 'block',
          width,
          opacity,
        }}
      />
    </div>
  );
}
