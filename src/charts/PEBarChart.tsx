import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from 'recharts';
import { AXIS_STYLE, GRID_STYLE, TOOLTIP_STYLE, LEGEND_STYLE, ZERO_LINE_STYLE, chartColors } from './chartDefaults';
import { CHART_MARGINS, getNiceTicks, getYAxisLayout } from '../utils/chartUtils';
import { cn } from '../utils/cn';

export interface PEBarChartProps {
  data: Record<string, unknown>[];
  xKey: string;
  yKey: string;
  height?: number;
  colorByValue?: boolean;
  positiveColor?: string;
  negativeColor?: string;
  fillColor?: string;
  showGrid?: boolean;
  showLegend?: boolean;
  xLabel?: string;
  yLabel?: string;
  yTicks?: number[];
  yDomain?: [number, number];
  margin?: { top?: number; right?: number; bottom?: number; left?: number };
  isAnimationActive?: boolean;
  formatTooltip?: (value: number) => string;
  className?: string;
  styles?: { root?: React.CSSProperties };
  rechartsProps?: Record<string, unknown>;
}

export function PEBarChart({
  data,
  xKey,
  yKey,
  height = 400,
  colorByValue = false,
  positiveColor = chartColors.primary,
  negativeColor = 'var(--color-gray-600)',
  fillColor = chartColors.primary,
  showGrid = true,
  showLegend = false,
  xLabel,
  yLabel,
  yTicks,
  yDomain,
  margin = CHART_MARGINS.bar,
  isAnimationActive = false,
  formatTooltip,
  className,
  styles,
  rechartsProps,
}: PEBarChartProps) {
  const computedTicks = yTicks ?? getNiceTicks([
    Math.min(0, ...data.map((d) => d[yKey] as number)),
    Math.max(0, ...data.map((d) => d[yKey] as number)),
  ], 5);
  const yAxis = getYAxisLayout(computedTicks, !!yLabel);

  return (
    <div className={cn('w-full', className)} style={styles?.root}>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ ...margin, left: (margin.left ?? 0) + yAxis.marginLeft }} {...rechartsProps}>
          {showGrid && <CartesianGrid {...GRID_STYLE} vertical={false} />}
          <XAxis
            dataKey={xKey}
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
            label={yLabel ? { value: yLabel, angle: -90, position: 'center', dx: yAxis.labelDx, style: AXIS_STYLE } : undefined}
          />
          <Tooltip
            {...TOOLTIP_STYLE}
            formatter={formatTooltip ? (v: number) => formatTooltip(v) : undefined}
          />
          {showLegend && <Legend {...LEGEND_STYLE} />}
          <ReferenceLine y={0} {...ZERO_LINE_STYLE} />
          <Bar dataKey={yKey} radius={[4, 4, 0, 0]} isAnimationActive={isAnimationActive}>
            {colorByValue
              ? data.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={
                      (entry[yKey] as number) >= 0
                        ? positiveColor
                        : negativeColor
                    }
                  />
                ))
              : data.map((_, index) => (
                  <Cell key={index} fill={fillColor} />
                ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
