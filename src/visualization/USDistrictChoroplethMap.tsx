/**
 * US Congressional District Choropleth Map
 *
 * Renders a geographic or hex choropleth map of US congressional districts using
 * d3-geo projections (pure SVG). GeoJSON data is bundled — no runtime fetching required.
 * Supports diverging color scales, custom formatting, and state-level zooming.
 */

import { useCallback, useId, useMemo, useRef, useState } from 'react';
import { geoPath, geoAlbersUsa, geoEquirectangular } from 'd3-geo';
import type {
  ChoroplethDataPoint,
  ChoroplethMapConfig,
  GeoJSONFeature,
  GeoJSONFeatureCollection,
  MapVisualizationType,
  ColorRange,
} from './types';
import {
  calculateColorRange,
  createDataLookupMap,
  getDistrictColor,
  DEFAULT_CHOROPLETH_CONFIG,
  STATE_ABBREV_TO_FIPS,
} from './utils';
import { CONGRESSIONAL_DISTRICTS_GEO } from './data/congressionalDistrictsGeo';
import { CONGRESSIONAL_DISTRICTS_HEX } from './data/congressionalDistrictsHex';
import { DIVERGING_GRAY_TEAL } from '../charts/colorSemantics';
import { PolicyEngineWatermark } from '../display/PolicyEngineWatermark';
import { ZoomControls } from './ZoomControls';
import { cn } from '../utils/cn';

export interface USDistrictChoroplethMapProps {
  /** Array of data points to visualize */
  data: ChoroplethDataPoint[];
  /** Configuration for the map */
  config?: Partial<ChoroplethMapConfig>;
  /** State code to focus/zoom on (e.g., 'ca', 'ny') */
  focusState?: string;
  /** Map visualization type: 'geographic' or 'hex' */
  visualizationType?: MapVisualizationType;
  /** Optional ref to the map container for image export */
  exportRef?: React.Ref<HTMLDivElement>;
  /** State abbreviations whose fetches errored (colored red) */
  errorStates?: string[];
  className?: string;
  styles?: { root?: React.CSSProperties };
}

const GEOJSON_MAP: Record<MapVisualizationType, GeoJSONFeatureCollection> = {
  geographic: CONGRESSIONAL_DISTRICTS_GEO,
  hex: CONGRESSIONAL_DISTRICTS_HEX,
};

const NO_DATA_FILL = '#CBD5E1'; // gray-300
const BORDER_COLOR = '#FFFFFF';
const BORDER_WIDTH = 0.5;
const COLOR_BAR_WIDTH = 16;
const COLOR_BAR_HEIGHT_FRACTION = 0.6;
const SVG_WIDTH = 800;

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
    width: partial?.width ?? DEFAULT_CHOROPLETH_CONFIG.width!,
    height: partial?.height ?? DEFAULT_CHOROPLETH_CONFIG.height!,
    colorScale: {
      colors: partial?.colorScale?.colors ?? [...DIVERGING_GRAY_TEAL],
      symmetric: partial?.colorScale?.symmetric ?? true,
    },
    projectionConfig: partial?.projectionConfig ?? {},
    defaultFill: partial?.defaultFill ?? DEFAULT_CHOROPLETH_CONFIG.defaultFill!,
    borderColor: partial?.borderColor ?? DEFAULT_CHOROPLETH_CONFIG.borderColor!,
    borderWidth: partial?.borderWidth ?? DEFAULT_CHOROPLETH_CONFIG.borderWidth!,
    showColorBar: partial?.showColorBar ?? true,
    formatValue: partial?.formatValue ?? ((v: number) => v.toFixed(2)),
  };
}

/**
 * Filter features to a specific US state by state abbreviation.
 */
function filterFeaturesByState(
  geoJSON: GeoJSONFeatureCollection,
  focusState: string,
): GeoJSONFeatureCollection {
  const statePrefix = `${focusState.toUpperCase()}-`;
  const fips = STATE_ABBREV_TO_FIPS[focusState.toLowerCase()];

  const filtered = geoJSON.features.filter((f) => {
    const districtId = f.properties?.DISTRICT_ID as string | undefined;
    const stateFp = f.properties?.STATEFP as string | undefined;
    return (districtId && districtId.startsWith(statePrefix)) || (fips && stateFp === fips);
  });

  return { ...geoJSON, features: filtered };
}

/**
 * Build a d3-geo path generator for the given GeoJSON, visualization type, and viewport.
 * - Geographic: geoAlbersUsa with fitExtent
 * - Hex: geoEquirectangular with fitExtent
 */
function usePathGenerator(
  geoJSON: GeoJSONFeatureCollection,
  isHex: boolean,
  svgWidth: number,
  svgHeight: number,
) {
  return useMemo(() => {
    const padding = 20;
    const extent: [[number, number], [number, number]] = [
      [padding, padding],
      [svgWidth - padding, svgHeight - padding],
    ];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const collection = geoJSON as any;

    const projection = isHex
      ? geoEquirectangular().fitExtent(extent, collection)
      : geoAlbersUsa().fitExtent(extent, collection);

    return geoPath(projection);
  }, [geoJSON, isHex, svgWidth, svgHeight]);
}

export function USDistrictChoroplethMap({
  data,
  config,
  focusState,
  visualizationType = 'geographic',
  exportRef,
  errorStates,
  className,
  styles,
}: USDistrictChoroplethMapProps) {
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

  const geoJSON = GEOJSON_MAP[visualizationType];
  const fullConfig = useMemo(() => mergeMapConfig(config), [config]);
  const dataMap = useMemo(() => createDataLookupMap(data), [data]);

  const colorRange: ColorRange = useMemo(
    () => calculateColorRange(data.map((d) => d.value), fullConfig.colorScale.symmetric ?? true),
    [data, fullConfig.colorScale.symmetric],
  );

  const errorStateSet = useMemo(
    () => new Set(errorStates?.map((s) => s.toUpperCase()) ?? []),
    [errorStates],
  );

  // Filter features when focusState is set
  const displayGeoJSON = useMemo(() => {
    if (!focusState) return geoJSON;
    return filterFeaturesByState(geoJSON, focusState);
  }, [geoJSON, focusState]);

  // Build path generator — fitExtent auto-zooms to filtered features
  const pathGen = usePathGenerator(displayGeoJSON, isHexMap, SVG_WIDTH, fullConfig.height);

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
    (event: React.MouseEvent, districtId: string) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const stateAbbr = districtId.split('-')[0]?.toUpperCase();
      if (stateAbbr && errorStateSet.has(stateAbbr)) {
        setTooltip({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
          label: districtId,
          value: 'Error loading data',
        });
        return;
      }

      const dataPoint = dataMap.get(districtId);
      if (!dataPoint) return;

      setTooltip({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        label: dataPoint.label,
        value: fullConfig.formatValue(dataPoint.value),
      });
    },
    [dataMap, fullConfig, errorStateSet],
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
        <span className="text-sm text-muted-foreground">No district data available</span>
      </div>
    );
  }

  const gradientId = `choropleth-gradient-${uniqueId.replace(/:/g, '')}`;

  return (
    <div
      ref={mergedRef}
      className={cn('flex items-stretch relative', className)}
      style={{ height: fullConfig.height, ...styles?.root }}
    >
      {/* Map */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <svg
          width={SVG_WIDTH}
          height={fullConfig.height}
          viewBox={`0 0 ${SVG_WIDTH} ${fullConfig.height}`}
          style={{ width: '100%', height: '100%', cursor: svgZoom > 1 ? 'grab' : 'default' }}
          onWheel={handleWheel}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          <g transform={`translate(${SVG_WIDTH / 2}, ${fullConfig.height / 2}) scale(${svgZoom}) translate(${-SVG_WIDTH / 2 + svgPan[0]}, ${-fullConfig.height / 2 + svgPan[1]})`}>
            {displayGeoJSON.features.map((feature: GeoJSONFeature) => {
              const districtId = feature.properties?.DISTRICT_ID as string | undefined;
              const stateAbbr = districtId?.split('-')[0]?.toUpperCase();
              const isErrorState = stateAbbr ? errorStateSet.has(stateAbbr) : false;
              const dataPoint = districtId ? dataMap.get(districtId) : undefined;

              const fillColor = isErrorState
                ? 'rgba(220, 53, 69, 0.5)'
                : dataPoint
                  ? getDistrictColor(
                      dataPoint.value,
                      colorRange,
                      fullConfig.colorScale.colors,
                    )
                  : NO_DATA_FILL;

              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const d = pathGen(feature as any) ?? undefined;

              return (
                <path
                  key={districtId ?? (feature.properties?.GEOID as string)}
                  d={d}
                  fill={fillColor}
                  stroke={BORDER_COLOR}
                  strokeWidth={BORDER_WIDTH}
                  style={{ cursor: 'default', transition: 'opacity 0.15s' }}
                  onMouseEnter={(e) => {
                    if (districtId) handleMouseEnter(e, districtId);
                  }}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                />
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
