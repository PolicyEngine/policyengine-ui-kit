import { MAP_TOOLTIP_SHADOW } from './constants';
import { cn } from '../utils/cn';

export interface MapTooltipProps {
  x: number;
  y: number;
  label: string;
  value: string;
  className?: string;
  styles?: { root?: React.CSSProperties };
}

export function MapTooltip({ x, y, label, value, className, styles }: MapTooltipProps) {
  return (
    <div
      role="tooltip"
      className={cn(className)}
      style={{
        position: 'absolute',
        left: x + 12,
        top: y - 30,
        backgroundColor: 'var(--background)',
        border: '1px solid var(--border)',
        borderRadius: 8,
        padding: '4px 8px',
        fontSize: 12,
        pointerEvents: 'none',
        zIndex: 10,
        boxShadow: MAP_TOOLTIP_SHADOW,
        whiteSpace: 'nowrap',
        ...styles?.root,
      }}
    >
      <div style={{ fontWeight: 600 }}>{label}</div>
      <div style={{ color: 'var(--muted-foreground)' }}>{value}</div>
    </div>
  );
}
