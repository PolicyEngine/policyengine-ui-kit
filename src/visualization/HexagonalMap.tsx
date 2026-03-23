import { useRef, useState, useMemo } from 'react';
import type { HexMapDataPoint, HexMapConfig, ColorRange } from './types';
import { calculateColorRange, getDistrictColor, generateHoverText } from './utils';
import { DIVERGING_GRAY_TEAL } from '../charts/colorSemantics';
import { MapDownloadButton } from './MapDownloadButton';
import { cn } from '../utils/cn';

export interface HexagonalMapProps {
  data: HexMapDataPoint[];
  config?: HexMapConfig;
  formatter?: (value: number) => string;
  onHexClick?: (dataPoint: HexMapDataPoint) => void;
  width?: number;
  height?: number;
  /** When set, shows a download button that exports the map as an SVG. */
  downloadFilename?: string;
  className?: string;
  styles?: { root?: React.CSSProperties };
}

const DEFAULT_CONFIG: Required<HexMapConfig> = {
  hexSize: 30,
  gap: 2,
  colorScale: { colors: [...DIVERGING_GRAY_TEAL], symmetric: true },
  showLabels: true,
  labelFontSize: 10,
};

function hexPoints(cx: number, cy: number, size: number): string {
  const points: string[] = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    points.push(
      `${cx + size * Math.cos(angle)},${cy + size * Math.sin(angle)}`,
    );
  }
  return points.join(' ');
}

export function HexagonalMap({
  data,
  config,
  formatter,
  onHexClick,
  width = 800,
  height = 500,
  downloadFilename,
  className,
  styles,
}: HexagonalMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [tooltipInfo, setTooltipInfo] = useState<{ x: number; y: number; text: string } | null>(null);

  const cfg = { ...DEFAULT_CONFIG, ...config };
  const colors = cfg.colorScale.colors;

  const range: ColorRange = useMemo(
    () => calculateColorRange(data.map((d) => d.value), cfg.colorScale.symmetric),
    [data, cfg.colorScale.symmetric],
  );

  const hexWidth = cfg.hexSize * Math.sqrt(3);
  const hexHeight = cfg.hexSize * 2;

  return (
    <div ref={containerRef} className={cn('relative bg-white border border-border rounded-lg overflow-hidden', className)} style={styles?.root}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {data.map((d) => {
          const cx = d.x * (hexWidth + cfg.gap) + hexWidth / 2 + 20;
          const cy = d.y * (hexHeight * 0.75 + cfg.gap) + hexHeight / 2 + 20;
          const fill = getDistrictColor(d.value, range, colors);
          const isHovered = hoveredId === d.id;

          return (
            <g key={d.id}>
              <polygon
                points={hexPoints(cx, cy, cfg.hexSize)}
                fill={fill}
                stroke={isHovered ? 'var(--foreground)' : 'white'}
                strokeWidth={isHovered ? 2 : 0.5}
                style={{ cursor: onHexClick ? 'pointer' : 'default', transition: 'stroke-width 0.15s' }}
                onMouseEnter={(e) => {
                  setHoveredId(d.id);
                  setTooltipInfo({
                    x: e.clientX,
                    y: e.clientY,
                    text: generateHoverText(d.label, d.value, formatter),
                  });
                }}
                onMouseLeave={() => {
                  setHoveredId(null);
                  setTooltipInfo(null);
                }}
                onClick={() => onHexClick?.(d)}
              />
              {cfg.showLabels && (
                <text
                  x={cx}
                  y={cy}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={cfg.labelFontSize}
                  fontFamily="var(--font-sans)"
                  fill="var(--foreground)"
                  pointerEvents="none"
                >
                  {d.id}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Color bar */}
      <div className="flex items-center gap-2 mt-2 px-4">
        <span className="text-xs text-muted-foreground">
          {formatter ? formatter(range.min) : range.min.toFixed(2)}
        </span>
        <div
          className="flex-1 h-3 rounded"
          style={{
            background: `linear-gradient(to right, ${colors.join(', ')})`,
          }}
        />
        <span className="text-xs text-muted-foreground">
          {formatter ? formatter(range.max) : range.max.toFixed(2)}
        </span>
      </div>

      {/* Download button */}
      {downloadFilename && (
        <MapDownloadButton containerRef={containerRef} filename={downloadFilename} />
      )}

      {/* Tooltip */}
      {tooltipInfo && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{
            left: tooltipInfo.x + 12,
            top: tooltipInfo.y - 8,
            fontFamily: 'var(--font-sans)',
            fontSize: 13,
            backgroundColor: 'var(--background)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            boxShadow: '0 4px 12px rgba(16, 24, 40, 0.1)',
            padding: '6px 10px',
          }}
        >
          {tooltipInfo.text}
        </div>
      )}
    </div>
  );
}
