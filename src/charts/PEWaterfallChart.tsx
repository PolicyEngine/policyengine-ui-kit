/**
 * PEWaterfallChart — a Recharts-based waterfall chart using stacked bars.
 *
 * Accepts pre-computed WaterfallDatum[] (from computeWaterfallData) and a
 * yDomain (from getWaterfallDomain). Supports connector lines, bar labels,
 * custom fill colors, and fillHeight mode.
 */

import type { ReactElement } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from 'recharts';
import {
  AXIS_STYLE,
  GRID_STYLE,
  TOOLTIP_STYLE,
  TOOLTIP_CONTAINER_STYLE,
  ZERO_LINE_STYLE,
  chartColors,
} from './chartDefaults';
import { CHART_MARGINS, getYAxisLayout } from '../utils/chartUtils';
import { cn } from '../utils/cn';
import { computeWaterfallConnectors, type WaterfallDatum } from './waterfallUtils';

export type { WaterfallItem, WaterfallDatum } from './waterfallUtils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PEWaterfallChartProps {
  /** Pre-computed waterfall data from computeWaterfallData() */
  data: WaterfallDatum[];
  /** Y-axis domain from getWaterfallDomain() */
  yDomain: [number, number];
  /** Chart height in pixels (ignored when fillHeight is true) */
  height?: number;
  /** When true, chart fills its parent via flex layout instead of using a fixed height */
  fillHeight?: boolean;
  /** Fill color resolver — receives datum, returns CSS color string */
  fillColor: (datum: WaterfallDatum) => string;
  /** Whether to show the grid (default: true) */
  showGrid?: boolean;
  /** X-axis label */
  xLabel?: string;
  /** Y-axis label (e.g. "Budgetary impact (bn)") */
  yLabel?: string;
  /** Explicit Y-axis tick values */
  yTicks?: number[];
  /** Number of Y-axis ticks when yTicks not provided (default: 5) */
  yTickCount?: number;
  /** Y-axis tick formatter */
  yTickFormatter?: (value: number) => string;
  /** Whether to show bar labels (default: true) */
  showBarLabels?: boolean;
  /** Formatter for bar labels (receives the signed value) */
  barLabelFormatter?: (value: number) => string;
  /** Whether to show dashed connector lines between bars (default: true) */
  showConnectors?: boolean;
  /** Optional custom tooltip content */
  tooltipContent?: ReactElement;
  /** Format tooltip values (receives signed value) */
  formatTooltip?: (value: number) => string;
  /** Chart margins (left is dynamically computed via getYAxisLayout) */
  margin?: { top?: number; right?: number; bottom?: number; left?: number };
  /** Disable animation (default: true = no animation) */
  isAnimationActive?: boolean;
  className?: string;
  styles?: { root?: React.CSSProperties };
  rechartsProps?: Record<string, unknown>;
}

// ---------------------------------------------------------------------------
// Internal types — extend WaterfallDatum with a computed bar height for Recharts
// ---------------------------------------------------------------------------

interface InternalDatum extends WaterfallDatum {
  /** Absolute bar height for Recharts stacked rendering */
  _barHeight: number;
}

// ---------------------------------------------------------------------------
// Default tooltip
// ---------------------------------------------------------------------------

function WaterfallTooltip({
  active,
  payload,
  formatValue,
}: {
  active?: boolean;
  payload?: Array<{ payload: WaterfallDatum }>;
  formatValue?: (value: number) => string;
}) {
  if (!active || !payload?.[0]) return null;
  const data = payload[0].payload;
  return (
    <div style={TOOLTIP_CONTAINER_STYLE}>
      <p style={{ fontWeight: 600, margin: 0 }}>{data.name}</p>
      <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--muted-foreground)' }}>
        {formatValue ? formatValue(data.value) : data.label}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function PEWaterfallChart({
  data,
  yDomain,
  height = 400,
  fillHeight = false,
  fillColor,
  showGrid = true,
  xLabel,
  yLabel,
  yTicks,
  yTickCount = 5,
  yTickFormatter,
  showBarLabels = true,
  barLabelFormatter,
  showConnectors = true,
  tooltipContent,
  formatTooltip,
  margin = CHART_MARGINS.waterfall,
  isAnimationActive = false,
  className,
  styles,
  rechartsProps,
}: PEWaterfallChartProps) {
  const computedTicks = yTicks ?? [];
  const yAxis = getYAxisLayout(computedTicks, !!yLabel, yTickFormatter);

  // Build internal data with _barHeight for Recharts
  const internalData: InternalDatum[] = data.map((d) => ({
    ...d,
    _barHeight: Math.abs(d.range[1] - d.range[0]),
  }));

  // Pre-compute connector lookup
  const connectors = showConnectors ? computeWaterfallConnectors(data) : [];
  const connectorsByTarget = new Map(connectors.map((c) => [c.toIndex, c]));

  // Mutable array collecting bar pixel positions during label rendering
  const barPositions: { x: number; y: number; width: number; height: number }[] = [];

  // Combined render function for bar labels + connector lines
  const renderLabelAndConnectors =
    showBarLabels || showConnectors
      ? (props: Record<string, unknown>) => {
          const idx = props.index as number;
          const x = props.x as number;
          const y = props.y as number;
          const w = props.width as number;
          const h = props.height as number;

          barPositions[idx] = { x, y, width: w, height: h };

          const conn = connectorsByTarget.get(idx);
          const fromBar = conn ? barPositions[conn.fromIndex] : undefined;
          // For positive bars the running total is at the top edge;
          // for negative bars it's at the bottom edge.
          const fromDatum = conn ? internalData[conn.fromIndex] : undefined;
          const connYPx = fromBar
            ? (fromDatum && fromDatum.value < 0
                ? fromBar.y + fromBar.height
                : fromBar.y)
            : undefined;

          const barHeight = Math.abs(h);
          const showLabel = showBarLabels && barHeight >= 20;
          const datum = internalData[idx];
          const text = barLabelFormatter
            ? barLabelFormatter(datum.value)
            : datum.label;

          return (
            <g>
              {connYPx != null && fromBar && showConnectors && (
                <line
                  x1={fromBar.x + fromBar.width}
                  y1={connYPx}
                  x2={x}
                  y2={connYPx}
                  stroke="var(--color-gray-300)"
                  strokeWidth={1}
                  strokeDasharray="3 3"
                />
              )}
              {showLabel && (
                <text
                  x={x + w / 2}
                  y={y + h / 2}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={13}
                  fontWeight={500}
                  fontFamily="var(--font-sans)"
                  fill="#FFFFFF"
                >
                  {text}
                </text>
              )}
            </g>
          );
        }
      : undefined;

  const chart = (
    <ResponsiveContainer width="100%" height={fillHeight ? '100%' : height}>
      <BarChart
        data={internalData}
        margin={{ ...margin, left: (margin.left ?? 0) + yAxis.marginLeft }}
        {...rechartsProps}
      >
        {showGrid && <CartesianGrid {...GRID_STYLE} vertical={false} />}
        <XAxis
          dataKey="name"
          tick={AXIS_STYLE}
          tickLine={false}
          axisLine={{ stroke: 'var(--border)' }}
          label={
            xLabel
              ? { value: xLabel, position: 'insideBottom', offset: -5, style: AXIS_STYLE }
              : undefined
          }
        />
        <YAxis
          domain={yDomain}
          ticks={yTicks}
          tickCount={yTicks ? undefined : yTickCount}
          tick={AXIS_STYLE}
          tickLine={false}
          axisLine={{ stroke: 'var(--border)' }}
          tickFormatter={yTickFormatter}
          width={yAxis.yAxisWidth}
          label={
            yLabel
              ? {
                  value: yLabel,
                  angle: -90,
                  position: 'center' as const,
                  dx: yAxis.labelDx,
                  style: { textAnchor: 'middle', ...AXIS_STYLE },
                }
              : undefined
          }
        />
        <ReferenceLine y={0} {...ZERO_LINE_STYLE} />
        {tooltipContent ? (
          <Tooltip content={tooltipContent} />
        ) : (
          <Tooltip
            content={<WaterfallTooltip formatValue={formatTooltip} />}
          />
        )}
        <Bar
          dataKey="base"
          stackId="waterfall"
          fill="none"
          stroke="none"
          isAnimationActive={isAnimationActive}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          shape={(props: any) => (
            <rect
              x={props.x}
              y={props.y}
              width={props.width}
              height={props.height}
              fill="none"
              stroke="none"
            />
          )}
        />
        <Bar
          dataKey="_barHeight"
          stackId="waterfall"
          radius={[4, 4, 0, 0]}
          isAnimationActive={isAnimationActive}
          label={renderLabelAndConnectors}
        >
          {internalData.map((entry, index) => (
            <Cell key={index} fill={fillColor(entry)} stroke="none" />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );

  if (fillHeight) {
    return (
      <div
        className={cn('flex flex-col h-full', className)}
        style={styles?.root}
      >
        <div className="flex-1 min-h-0">{chart}</div>
      </div>
    );
  }

  return (
    <div className={cn('w-full', className)} style={styles?.root}>
      {chart}
    </div>
  );
}
