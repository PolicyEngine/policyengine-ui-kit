import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { AXIS_STYLE, GRID_STYLE, TOOLTIP_STYLE, LEGEND_STYLE, chartColors } from './chartDefaults';
import { CHART_MARGINS, getNiceTicks, getYAxisLayout } from '../utils/chartUtils';
import { cn } from '../utils/cn';

export interface PEAreaChartSeries {
  dataKey: string;
  name?: string;
  color?: string;
  fillOpacity?: number;
}

export interface PEAreaChartProps {
  data: Record<string, unknown>[];
  xKey: string;
  series: PEAreaChartSeries[];
  height?: number;
  stacked?: boolean;
  showGrid?: boolean;
  showLegend?: boolean;
  xLabel?: string;
  yLabel?: string;
  yTicks?: number[];
  yDomain?: [number, number];
  margin?: { top?: number; right?: number; bottom?: number; left?: number };
  formatTooltip?: (value: number) => string;
  className?: string;
  styles?: { root?: React.CSSProperties };
  rechartsProps?: Record<string, unknown>;
}

export function PEAreaChart({
  data,
  xKey,
  series,
  height = 400,
  stacked = true,
  showGrid = true,
  showLegend = true,
  xLabel,
  yLabel,
  yTicks,
  yDomain,
  margin = CHART_MARGINS.area,
  formatTooltip,
  className,
  styles,
  rechartsProps,
}: PEAreaChartProps) {
  const computedTicks = yTicks ?? getNiceTicks([
    Math.min(...data.map((d) => Math.min(...series.map((s) => d[s.dataKey] as number)))),
    Math.max(...data.map((d) => Math.max(...series.map((s) => d[s.dataKey] as number)))),
  ], 5);
  const yAxis = getYAxisLayout(computedTicks, !!yLabel);

  return (
    <div className={cn('w-full', className)} style={styles?.root}>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ ...margin, left: (margin.left ?? 0) + yAxis.marginLeft }} {...rechartsProps}>
          {showGrid && <CartesianGrid {...GRID_STYLE} />}
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
          {series.map((s, i) => {
            const color = s.color ?? chartColors.series[i % chartColors.series.length];
            return (
              <Area
                key={s.dataKey}
                type="monotone"
                dataKey={s.dataKey}
                name={s.name ?? s.dataKey}
                stroke={color}
                fill={color}
                fillOpacity={s.fillOpacity ?? 0.3}
                stackId={stacked ? 'stack' : undefined}
                strokeWidth={2}
              />
            );
          })}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
