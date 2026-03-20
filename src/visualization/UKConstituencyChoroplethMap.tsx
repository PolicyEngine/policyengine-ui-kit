/**
 * UK Parliamentary Constituency Choropleth Map
 *
 * Renders a geographic or hex choropleth map of UK parliamentary constituencies.
 * Geographic view uses British National Grid coordinates with d3-geo geoTransform.
 * Hex view uses axial q/r coordinates from bundled data.
 * Both datasets are bundled — no runtime fetching required.
 */

import { useCallback, useId, useMemo, useRef, useState } from 'react';
import { geoPath, geoTransform } from 'd3-geo';
import type {
  ChoroplethDataPoint,
  ChoroplethMapConfig,
  GeoJSONFeature,
  MapVisualizationType,
  ColorRange,
} from './types';
import {
  calculateColorRange,
  createDataLookupMap,
  getDistrictColor,
  DEFAULT_CHOROPLETH_CONFIG,
} from './utils';
import { UK_CONSTITUENCIES_GEO } from './data/ukConstituenciesGeo';
import { UK_CONSTITUENCIES_HEX } from './data/ukConstituenciesHex';
import { DIVERGING_GRAY_TEAL } from '../charts/colorSemantics';
import { PolicyEngineWatermark } from '../display/PolicyEngineWatermark';
import { ZoomControls } from './ZoomControls';
import { cn } from '../utils/cn';

export interface UKConstituencyChoroplethMapProps {
  /** Array of data points to visualize (geoId = GSS code, e.g. E14001063) */
  data: ChoroplethDataPoint[];
  /** Configuration for the map */
  config?: Partial<ChoroplethMapConfig>;
  /** Map visualization type: 'geographic' or 'hex' */
  visualizationType?: MapVisualizationType;
  /** Optional ref to the map container for image export */
  exportRef?: React.Ref<HTMLDivElement>;
  className?: string;
  styles?: { root?: React.CSSProperties };
}

const NO_DATA_FILL = '#CBD5E1'; // gray-300
const BORDER_COLOR = '#FFFFFF';
const BORDER_WIDTH = 0.3;
const COLOR_BAR_WIDTH = 16;
const COLOR_BAR_HEIGHT_FRACTION = 0.6;
const SVG_WIDTH = 600;
const DEFAULT_HEIGHT = 700;

// BNG bounding box for UK constituencies
const BNG_X_MIN = -62;
const BNG_X_MAX = 655600;
const BNG_Y_MIN = 7161;
const BNG_Y_MAX = 1218591;

interface TooltipState {
  x: number;
  y: number;
  label: string;
  value: string;
}

function ColorBar({
  scaleColors,
  height,
  min,
  max,
  formatValue,
  gradientId,
}: {
  scaleColors: string[];
  height: number;
  min: number;
  max: number;
  formatValue: (v: number) => string;
  gradientId: string;
}) {
  const barHeight = Math.round(height * COLOR_BAR_HEIGHT_FRACTION);
  const barY = Math.round((height - barHeight) / 2);

  return (
    <svg width={60} height={height} style={{ flexShrink: 0 }} role="img" aria-label="Color scale legend">
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

function mergeMapConfig(partial?: Partial<ChoroplethMapConfig>): Required<ChoroplethMapConfig> {
  return {
    width: partial?.width ?? SVG_WIDTH,
    height: partial?.height ?? DEFAULT_HEIGHT,
    colorScale: {
      colors: partial?.colorScale?.colors ?? [...DIVERGING_GRAY_TEAL],
      symmetric: partial?.colorScale?.symmetric ?? true,
    },
    projectionConfig: partial?.projectionConfig ?? {},
    defaultFill: partial?.defaultFill ?? DEFAULT_CHOROPLETH_CONFIG.defaultFill!,
    borderColor: partial?.borderColor ?? DEFAULT_CHOROPLETH_CONFIG.borderColor!,
    borderWidth: partial?.borderWidth ?? BORDER_WIDTH,
    showColorBar: partial?.showColorBar ?? true,
    formatValue: partial?.formatValue ?? ((v: number) => v.toFixed(2)),
  };
}

/**
 * Build an SVG path string for a BNG GeoJSON feature using an affine transform.
 * BNG coordinates are already projected (eastings/northings in meters), so we
 * apply a simple scale + translate + Y-flip to map them into the SVG viewport.
 */
function useBNGPathGenerator(svgWidth: number, svgHeight: number) {
  return useMemo(() => {
    const padding = 20;
    const drawWidth = svgWidth - padding * 2;
    const drawHeight = svgHeight - padding * 2;

    const bngWidth = BNG_X_MAX - BNG_X_MIN;
    const bngHeight = BNG_Y_MAX - BNG_Y_MIN;

    const scale = Math.min(drawWidth / bngWidth, drawHeight / bngHeight);
    const offsetX = padding + (drawWidth - bngWidth * scale) / 2;
    const offsetY = padding + (drawHeight - bngHeight * scale) / 2;

    const projection = geoTransform({
      point(x: number, y: number) {
        this.stream.point(
          (x - BNG_X_MIN) * scale + offsetX,
          svgHeight - ((y - BNG_Y_MIN) * scale + offsetY),
        );
      },
    });

    return geoPath().projection(projection);
  }, [svgWidth, svgHeight]);
}

/**
 * Build a GSS→constituency name lookup from the hex data.
 */
const GSS_TO_NAME: Map<string, string> = new Map(
  Object.entries(UK_CONSTITUENCIES_HEX).map(([name, { gss }]) => [gss, name]),
);

/**
 * Convert offset hex grid coordinates (x, y) to pixel positions.
 * Uses the same honeycomb offset as policyengine-app v1:
 * even rows (y % 2 === 0) get x offset by +0.5.
 */
function gridToPixel(
  x: number,
  y: number,
  hexSize: number,
): { cx: number; cy: number } {
  const hexWidth = hexSize * Math.sqrt(3);
  const adjustedX = y % 2 === 0 ? x + 0.5 : x;
  const cx = adjustedX * hexWidth;
  const cy = -y * hexSize * 1.5;
  return { cx, cy };
}

function hexPoints(cx: number, cy: number, size: number): string {
  const points: string[] = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    points.push(`${cx + size * Math.cos(angle)},${cy + size * Math.sin(angle)}`);
  }
  return points.join(' ');
}

/**
 * Pre-compute hex layout: derive hex size from grid coordinate ranges
 * to fill the SVG viewport, then compute pixel positions.
 */
function useHexLayout(svgWidth: number, svgHeight: number) {
  return useMemo(() => {
    const entries = Object.entries(UK_CONSTITUENCIES_HEX);

    // Find grid coordinate ranges
    let gMinX = Infinity, gMaxX = -Infinity, gMinY = Infinity, gMaxY = -Infinity;
    for (const [, { x, y }] of entries) {
      if (x < gMinX) gMinX = x;
      if (x > gMaxX) gMaxX = x;
      if (y < gMinY) gMinY = y;
      if (y > gMaxY) gMaxY = y;
    }

    const gridCols = gMaxX - gMinX + 2; // +2 for hex margin + offset
    const gridRows = gMaxY - gMinY + 2;

    const padding = 20;
    const drawW = svgWidth - padding * 2;
    const drawH = svgHeight - padding * 2;

    // Hex size from available space: columns need hexWidth * gridCols, rows need hexHeight * 0.75 * gridRows
    const hexSizeFromWidth = drawW / (gridCols * Math.sqrt(3));
    const hexSizeFromHeight = drawH / (gridRows * 1.5);
    const hexSize = Math.min(hexSizeFromWidth, hexSizeFromHeight);

    // Compute pixel positions with this hex size
    const positions = entries.map(([name, { x, y, gss }]) => {
      const { cx, cy } = gridToPixel(x, y, hexSize);
      return { name, gss, cx, cy };
    });

    // Find pixel bounds to center in viewport
    let fMinX = Infinity, fMaxX = -Infinity, fMinY = Infinity, fMaxY = -Infinity;
    for (const { cx, cy } of positions) {
      if (cx < fMinX) fMinX = cx;
      if (cx > fMaxX) fMaxX = cx;
      if (cy < fMinY) fMinY = cy;
      if (cy > fMaxY) fMaxY = cy;
    }

    const usedW = fMaxX - fMinX;
    const usedH = fMaxY - fMinY;
    const shiftX = padding + (drawW - usedW) / 2 - fMinX;
    const shiftY = padding + (drawH - usedH) / 2 - fMinY;

    return {
      hexSize,
      hexagons: positions.map(({ name, gss, cx, cy }) => ({
        name,
        gss,
        cx: cx + shiftX,
        cy: cy + shiftY,
      })),
    };
  }, [svgWidth, svgHeight]);
}

export function UKConstituencyChoroplethMap({
  data,
  config,
  visualizationType = 'geographic',
  exportRef,
  className,
  styles,
}: UKConstituencyChoroplethMapProps) {
  const uniqueId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const isHexMap = visualizationType === 'hex';

  const mergedRef = useCallback(
    (node: HTMLDivElement | null) => {
      (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
      if (typeof exportRef === 'function') {
        exportRef(node);
      } else if (exportRef) {
        (exportRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }
    },
    [exportRef],
  );

  const fullConfig = useMemo(() => mergeMapConfig(config), [config]);
  const dataMap = useMemo(() => createDataLookupMap(data), [data]);

  const colorRange: ColorRange = useMemo(
    () => calculateColorRange(data.map((d) => d.value), fullConfig.colorScale.symmetric ?? true),
    [data, fullConfig.colorScale.symmetric],
  );

  const pathGenerator = useBNGPathGenerator(fullConfig.width, fullConfig.height);
  const hexLayout = useHexLayout(fullConfig.width, fullConfig.height);

  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  // Zoom/pan state — manipulates a <g> transform inside the SVG
  const [svgZoom, setSvgZoom] = useState(1);
  const [svgPan, setSvgPan] = useState<[number, number]>([0, 0]);
  const isPanning = useRef(false);
  const panStart = useRef<[number, number]>([0, 0]);
  const panOrigin = useRef<[number, number]>([0, 0]);

  const handleZoomIn = useCallback(() => setSvgZoom((z) => Math.min(z * 1.5, 20)), []);
  const handleZoomOut = useCallback(() => setSvgZoom((z) => Math.max(z / 1.5, 0.5)), []);
  const handleZoomReset = useCallback(() => {
    setSvgZoom(1);
    setSvgPan([0, 0]);
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    setSvgZoom((z) => {
      const factor = e.deltaY < 0 ? 1.15 : 1 / 1.15;
      return Math.min(Math.max(z * factor, 0.5), 20);
    });
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    isPanning.current = true;
    panStart.current = [e.clientX, e.clientY];
    panOrigin.current = [...svgPan] as [number, number];
    (e.target as Element).setPointerCapture(e.pointerId);
  }, [svgPan]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isPanning.current) return;
    const dx = e.clientX - panStart.current[0];
    const dy = e.clientY - panStart.current[1];
    setSvgPan([panOrigin.current[0] + dx / svgZoom, panOrigin.current[1] + dy / svgZoom]);
  }, [svgZoom]);

  const handlePointerUp = useCallback(() => {
    isPanning.current = false;
  }, []);

  const handleMouseEnter = useCallback(
    (event: React.MouseEvent, geoId: string) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const dataPoint = dataMap.get(geoId);
      const name = GSS_TO_NAME.get(geoId) ?? geoId;

      setTooltip({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        label: dataPoint?.label ?? name,
        value: dataPoint ? fullConfig.formatValue(dataPoint.value) : 'No data',
      });
    },
    [dataMap, fullConfig],
  );

  const handleMouseMove = useCallback(
    (event: React.MouseEvent) => {
      if (!tooltip) return;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      setTooltip((prev) =>
        prev ? { ...prev, x: event.clientX - rect.left, y: event.clientY - rect.top } : null,
      );
    },
    [tooltip],
  );

  const handleMouseLeave = useCallback(() => {
    setTooltip(null);
  }, []);

  if (!data.length) {
    return (
      <div
        className={cn('flex items-center justify-center', className)}
        style={{ height: fullConfig.height, ...styles?.root }}
      >
        <span className="text-sm text-muted-foreground">No constituency data available</span>
      </div>
    );
  }

  const gradientId = `uk-choropleth-gradient-${uniqueId.replace(/:/g, '')}`;

  return (
    <div
      ref={mergedRef}
      className={cn('flex items-stretch relative', className)}
      style={{ height: fullConfig.height, ...styles?.root }}
    >
      {/* Map */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <svg
          width={fullConfig.width}
          height={fullConfig.height}
          viewBox={`0 0 ${fullConfig.width} ${fullConfig.height}`}
          style={{ width: '100%', height: '100%', cursor: svgZoom > 1 ? 'grab' : 'default' }}
          onWheel={handleWheel}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          <g transform={`translate(${fullConfig.width / 2}, ${fullConfig.height / 2}) scale(${svgZoom}) translate(${-fullConfig.width / 2 + svgPan[0]}, ${-fullConfig.height / 2 + svgPan[1]})`}>
          {isHexMap
            ? hexLayout.hexagons.map(({ name, gss, cx, cy }) => {
                const dataPoint = dataMap.get(gss);
                const fillColor = dataPoint
                  ? getDistrictColor(dataPoint.value, colorRange, fullConfig.colorScale.colors)
                  : NO_DATA_FILL;

                return (
                  <polygon
                    key={gss}
                    points={hexPoints(cx, cy, hexLayout.hexSize)}
                    fill={fillColor}
                    stroke={BORDER_COLOR}
                    strokeWidth={0.5}
                    style={{ cursor: 'default', transition: 'opacity 0.15s' }}
                    onMouseEnter={(e) => handleMouseEnter(e, gss)}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                  >
                    <title>{name}</title>
                  </polygon>
                );
              })
            : UK_CONSTITUENCIES_GEO.features.map((feature: GeoJSONFeature) => {
                const gssCode = feature.properties?.DISTRICT_ID as string | undefined;
                const name = feature.properties?.Name as string | undefined;
                const dataPoint = gssCode ? dataMap.get(gssCode) : undefined;
                const fillColor = dataPoint
                  ? getDistrictColor(dataPoint.value, colorRange, fullConfig.colorScale.colors)
                  : NO_DATA_FILL;

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const d = pathGenerator(feature as any) ?? undefined;

                return (
                  <path
                    key={gssCode ?? name}
                    d={d}
                    fill={fillColor}
                    stroke={fullConfig.borderColor}
                    strokeWidth={fullConfig.borderWidth}
                    style={{ cursor: 'default', transition: 'opacity 0.15s' }}
                    onMouseEnter={(e) => {
                      if (gssCode) handleMouseEnter(e, gssCode);
                    }}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                  >
                    <title>{name}</title>
                  </path>
                );
              })}
          </g>
        </svg>
      </div>

      {/* Color bar */}
      {fullConfig.showColorBar && (
        <ColorBar
          scaleColors={fullConfig.colorScale.colors}
          height={fullConfig.height}
          min={colorRange.min}
          max={colorRange.max}
          formatValue={fullConfig.formatValue}
          gradientId={gradientId}
        />
      )}

      {/* Tooltip */}
      {tooltip && (
        <div
          role="tooltip"
          style={{
            position: 'absolute',
            left: tooltip.x + 12,
            top: tooltip.y - 30,
            backgroundColor: 'var(--background)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            padding: '4px 8px',
            fontSize: 12,
            pointerEvents: 'none',
            zIndex: 10,
            boxShadow: '0 2px 6px rgba(16, 24, 40, 0.1)',
            whiteSpace: 'nowrap',
          }}
        >
          <div style={{ fontWeight: 600 }}>{tooltip.label}</div>
          <div style={{ color: 'var(--muted-foreground)' }}>{tooltip.value}</div>
        </div>
      )}

      {/* Zoom controls */}
      <ZoomControls onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} onReset={handleZoomReset} />

      {/* Watermark */}
      <div className="absolute bottom-1 right-2">
        <PolicyEngineWatermark width={60} opacity={0.6} />
      </div>
    </div>
  );
}
