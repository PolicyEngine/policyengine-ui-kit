import { COLOR_BAR_WIDTH, COLOR_BAR_HEIGHT_FRACTION } from './constants';
import { cn } from '../utils/cn';

export interface ColorBarProps {
  scaleColors: string[];
  height: number;
  min: number;
  max: number;
  formatValue: (v: number) => string;
  gradientId: string;
  className?: string;
  styles?: { root?: React.CSSProperties };
}

export function ColorBar({
  scaleColors,
  height,
  min,
  max,
  formatValue,
  gradientId,
  className,
  styles,
}: ColorBarProps) {
  if (scaleColors.length < 2) return null;

  const barHeight = Math.round(height * COLOR_BAR_HEIGHT_FRACTION);
  const barY = Math.round((height - barHeight) / 2);

  return (
    <svg
      className={className}
      width={60}
      height={height}
      style={{ flexShrink: 0, ...styles?.root }}
      role="img"
      aria-label="Color scale legend"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="1" x2="0" y2="0">
          {scaleColors.map((color, i) => (
            <stop key={i} offset={`${(i / (scaleColors.length - 1)) * 100}%`} stopColor={color} />
          ))}
        </linearGradient>
      </defs>
      <rect x={4} y={barY} width={COLOR_BAR_WIDTH} height={barHeight} fill={`url(#${gradientId})`} rx={2} />
      <text x={24} y={barY + 4} fontSize={10} fill="var(--foreground)" dominantBaseline="hanging">
        {formatValue(max)}
      </text>
      <text x={24} y={barY + barHeight - 4} fontSize={10} fill="var(--foreground)">
        {formatValue(min)}
      </text>
    </svg>
  );
}
