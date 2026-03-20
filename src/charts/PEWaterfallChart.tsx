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
import { AXIS_STYLE, GRID_STYLE, TOOLTIP_STYLE, ZERO_LINE_STYLE, chartColors } from './chartDefaults';
import { CHART_MARGINS, getNiceTicks, getYAxisLayout } from '../utils/chartUtils';
import { cn } from '../utils/cn';

export interface WaterfallItem {
  name: string;
  value: number;
  isTotal?: boolean;
}

export interface PEWaterfallChartProps {
  data: WaterfallItem[];
  height?: number;
  positiveColor?: string;
  negativeColor?: string;
  totalColor?: string;
  fillColor?: (item: WaterfallDatum, index: number) => string;
  showGrid?: boolean;
  xLabel?: string;
  yLabel?: string;
  yTicks?: number[];
  yDomain?: [number, number];
  yTickFormatter?: (value: number) => string;
  showBarLabels?: boolean;
  barLabelFormatter?: (value: number) => string;
  margin?: { top?: number; right?: number; bottom?: number; left?: number };
  isAnimationActive?: boolean;
  formatTooltip?: (value: number) => string;
  tooltipContent?: ReactElement;
  className?: string;
  styles?: { root?: React.CSSProperties };
  rechartsProps?: Record<string, unknown>;
}

interface WaterfallDatum {
  name: string;
  value: number;
  base: number;
  range: [number, number];
  fill: string;
  isTotal: boolean;
}

function buildWaterfallData(
  items: WaterfallItem[],
  positiveColor: string,
  negativeColor: string,
  totalColor: string,
  fillColorFn?: (item: WaterfallDatum, index: number) => string,
): WaterfallDatum[] {
  let running = 0;
  return items.map((item, index) => {
    if (item.isTotal) {
      const start = 0;
      const end = running;
      const datum: WaterfallDatum = {
        name: item.name,
        value: running,
        base: Math.min(start, end),
        range: [Math.min(start, end), Math.max(start, end)],
        fill: totalColor,
        isTotal: true,
      };
      if (fillColorFn) datum.fill = fillColorFn(datum, index);
      return datum;
    }
    const start = running;
    running += item.value;
    const end = running;
    const datum: WaterfallDatum = {
      name: item.name,
      value: item.value,
      base: Math.min(start, end),
      range: [Math.min(start, end), Math.max(start, end)],
      fill: item.value >= 0 ? positiveColor : negativeColor,
      isTotal: false,
    };
    if (fillColorFn) datum.fill = fillColorFn(datum, index);
    return datum;
  });
}

/** Label rendered centered inside a waterfall bar. */
function WaterfallBarLabel({
  x = 0,
  y = 0,
  width = 0,
  height = 0,
  value = 0,
  formatter,
}: {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  value?: number;
  formatter?: (v: number) => string;
}) {
  const barHeight = Math.abs(height);
  // Only show label if bar is tall enough
  if (barHeight < 20) return null;

  const text = formatter ? formatter(value) : String(value);

  return (
    <text
      x={x + width / 2}
      y={y + height / 2}
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={13}
      fontWeight={500}
      fontFamily="var(--font-sans)"
      fill="#FFFFFF"
    >
      {text}
    </text>
  );
}

export function PEWaterfallChart({
  data,
  height = 400,
  positiveColor = chartColors.primary,
  negativeColor = 'var(--color-gray-600)',
  totalColor = 'var(--chart-3)',
  fillColor,
  showGrid = true,
  xLabel,
  yLabel,
  yTicks,
  yDomain,
  yTickFormatter,
  showBarLabels = false,
  barLabelFormatter,
  margin = CHART_MARGINS.waterfall,
  isAnimationActive = false,
  formatTooltip,
  tooltipContent,
  className,
  styles,
  rechartsProps,
}: PEWaterfallChartProps) {
  const waterfallData = buildWaterfallData(data, positiveColor, negativeColor, totalColor, fillColor);
  const allValues = waterfallData.flatMap((d) => [d.base, d.base + d.value]);
  const computedTicks = yTicks ?? getNiceTicks([Math.min(...allValues), Math.max(...allValues)], 5);
  const yAxis = getYAxisLayout(computedTicks, !!yLabel, yTickFormatter);

  return (
    <div className={cn('w-full', className)} style={styles?.root}>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={waterfallData} margin={{ ...margin, left: (margin.left ?? 0) + yAxis.marginLeft }} {...rechartsProps}>
          {showGrid && <CartesianGrid {...GRID_STYLE} vertical={false} />}
          <XAxis
            dataKey="name"
            tick={AXIS_STYLE}
            tickLine={false}
            axisLine={{ stroke: 'var(--border)' }}
            label={xLabel ? { value: xLabel, position: 'insideBottom', offset: -5, style: AXIS_STYLE } : undefined}
          />
          <YAxis
            tick={AXIS_STYLE}
            tickLine={false}
            axisLine={{ stroke: 'var(--border)' }}
            ticks={yTicks}
            domain={yDomain}
            width={yAxis.yAxisWidth}
            tickFormatter={yTickFormatter}
            label={yLabel ? { value: yLabel, angle: -90, position: 'center', dx: yAxis.labelDx, style: AXIS_STYLE } : undefined}
          />
          {tooltipContent ? (
            <Tooltip content={tooltipContent} />
          ) : (
            <Tooltip
              {...TOOLTIP_STYLE}
              formatter={(v: unknown, name: string) => {
                if (name === 'base') return [null, null];
                const val = v as number;
                return formatTooltip ? [formatTooltip(val)] : [val];
              }}
            />
          )}
          <ReferenceLine y={0} {...ZERO_LINE_STYLE} />
          <Bar dataKey="base" stackId="waterfall" fill="transparent" isAnimationActive={isAnimationActive} />
          <Bar
            dataKey="value"
            stackId="waterfall"
            radius={[4, 4, 0, 0]}
            isAnimationActive={isAnimationActive}
            label={
              showBarLabels
                ? (props: Record<string, unknown>) => (
                    <WaterfallBarLabel
                      x={props.x as number}
                      y={props.y as number}
                      width={props.width as number}
                      height={props.height as number}
                      value={props.value as number}
                      formatter={barLabelFormatter}
                    />
                  )
                : undefined
            }
          >
            {waterfallData.map((entry, index) => (
              <Cell key={index} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
