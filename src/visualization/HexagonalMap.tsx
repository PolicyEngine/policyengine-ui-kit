import { useId, useRef, useState, useMemo } from 'react';
import type { HexMapDataPoint, HexMapConfig, ColorRange } from './types';
import { calculateColorRange, getDistrictColor, generateHoverText, hexPoints } from './utils';
import { DIVERGING_GRAY_TEAL } from '../charts/colorSemantics';
import { PolicyEngineWatermark } from '../display/PolicyEngineWatermark';
import { MapDownloadButton } from './MapDownloadButton';
import { ColorBar } from './ColorBar';
import { MAP_TOOLTIP_SHADOW } from './constants';
import { cn } from '../utils/cn';

export interface HexagonalMapProps {
  data: HexMapDataPoint[];
  config?: HexMapConfig;
  formatter?: (value: number) => string;
  onHexClick?: (dataPoint: HexMapDataPoint) => void;
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

export function HexagonalMap({
  data,
  config,
  formatter,
  onHexClick,
  downloadFilename,
  className,
  styles,
}: HexagonalMapProps) {
  const uniqueId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [tooltipInfo, setTooltipInfo] = useState<{ x: number; y: number; text: string } | null>(null);

  const cfg = { ...DEFAULT_CONFIG, ...config };
  const colors = cfg.colorScale.colors;

  const range: ColorRange = useMemo(
    () => calculateColorRange(data.map((d) => d.value), cfg.colorScale.symmetric),
    [data, cfg.colorScale.symmetric],
  );

  const hexW = cfg.hexSize * Math.sqrt(3);
  const hexH = cfg.hexSize * 2;
  const rowH = hexH * 0.75 + cfg.gap;

  // Compute pixel positions, then derive tight SVG dimensions
  const positions = useMemo(() => {
    return data.map((d) => ({
      ...d,
      cx: d.x * (hexW + cfg.gap) + hexW / 2,
      cy: d.y * rowH + hexH / 2,
    }));
  }, [data, hexW, hexH, rowH, cfg.gap]);

  const { svgWidth, svgHeight, offsetX, offsetY } = useMemo(() => {
    if (positions.length === 0) return { svgWidth: 200, svgHeight: 200, offsetX: 0, offsetY: 0 };
    const pad = cfg.hexSize + 4;
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const p of positions) {
      if (p.cx < minX) minX = p.cx;
      if (p.cx > maxX) maxX = p.cx;
      if (p.cy < minY) minY = p.cy;
      if (p.cy > maxY) maxY = p.cy;
    }
    return {
      svgWidth: Math.ceil(maxX - minX + pad * 2),
      svgHeight: Math.ceil(maxY - minY + pad * 2),
      offsetX: -minX + pad,
      offsetY: -minY + pad,
    };
  }, [positions, cfg.hexSize]);

  const gradientId = `hex-gradient-${uniqueId.replace(/:/g, '')}`;
  const formatValue = formatter ?? ((v: number) => v.toFixed(2));

  return (
    <div
      ref={containerRef}
      className={cn('inline-flex items-stretch relative bg-white border border-border rounded-lg overflow-hidden', className)}
      style={styles?.root}
    >
      {/* Map */}
      <div style={{ flexShrink: 0 }}>
        <svg
          width={svgWidth}
          height={svgHeight}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        >
          {positions.map((d) => {
            const cx = d.cx + offsetX;
            const cy = d.cy + offsetY;
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
      </div>

      {/* Vertical color bar */}
      <ColorBar
        scaleColors={colors}
        height={svgHeight}
        min={range.min}
        max={range.max}
        formatValue={formatValue}
        gradientId={gradientId}
      />

      {/* Download button */}
      {downloadFilename && (
        <MapDownloadButton containerRef={containerRef} filename={downloadFilename} />
      )}

      {/* Watermark */}
      <div className="absolute bottom-1 right-2">
        <PolicyEngineWatermark width={160} opacity={0.6} />
      </div>

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
            boxShadow: MAP_TOOLTIP_SHADOW,
            padding: '6px 10px',
          }}
        >
          {tooltipInfo.text}
        </div>
      )}
    </div>
  );
}
