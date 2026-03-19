import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceDot,
} from 'recharts';
import { AXIS_STYLE, GRID_STYLE, TOOLTIP_STYLE, LEGEND_STYLE, chartColors } from './chartDefaults';
import { CHART_MARGINS, getNiceTicks, getYAxisLabelDx } from '../utils/chartUtils';
import { cn } from '../utils/cn';

export interface PELineChartSeries {
  dataKey: string;
  name?: string;
  color?: string;
  strokeDasharray?: string;
}

export interface PEReferenceDot {
  x: number | string;
  y: number;
  label?: string;
  color?: string;
}

export interface PELineChartProps {
  data: Record<string, unknown>[];
  xKey: string;
  series: PELineChartSeries[];
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  xLabel?: string;
  yLabel?: string;
  yTicks?: number[];
  yDomain?: [number, number];
  margin?: { top?: number; right?: number; bottom?: number; left?: number };
  referenceDots?: PEReferenceDot[];
  formatTooltip?: (value: number) => string;
  className?: string;
  styles?: { root?: React.CSSProperties };
  rechartsProps?: Record<string, unknown>;
}

export function PELineChart({
  data,
  xKey,
  series,
  height = 400,
  showGrid = true,
  showLegend = true,
  xLabel,
  yLabel,
  yTicks,
  yDomain,
  margin = CHART_MARGINS.line,
  referenceDots,
  formatTooltip,
  className,
  styles,
  rechartsProps,
}: PELineChartProps) {
  const computedTicks = yTicks ?? getNiceTicks([
    Math.min(...data.map((d) => Math.min(...series.map((s) => d[s.dataKey] as number)))),
    Math.max(...data.map((d) => Math.max(...series.map((s) => d[s.dataKey] as number)))),
  ], 5);
  const yLabelDx = yLabel ? getYAxisLabelDx(computedTicks) : 0;

  return (
    <div className={cn('w-full', className)} style={styles?.root}>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={margin} {...rechartsProps}>
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
            label={yLabel ? { value: yLabel, angle: -90, position: 'center', dx: yLabelDx, style: AXIS_STYLE } : undefined}
          />
          <Tooltip
            {...TOOLTIP_STYLE}
            formatter={formatTooltip ? (v: number) => formatTooltip(v) : undefined}
          />
          {showLegend && <Legend {...LEGEND_STYLE} />}
          {series.map((s, i) => (
            <Line
              key={s.dataKey}
              type="monotone"
              dataKey={s.dataKey}
              name={s.name ?? s.dataKey}
              stroke={s.color ?? chartColors.series[i % chartColors.series.length]}
              strokeWidth={2}
              dot={false}
              strokeDasharray={s.strokeDasharray}
            />
          ))}
          {referenceDots?.map((dot, i) => (
            <ReferenceDot
              key={i}
              x={dot.x}
              y={dot.y}
              r={5}
              fill={dot.color ?? chartColors.primary}
              stroke="white"
              strokeWidth={2}
              label={dot.label ? { value: dot.label, position: 'top', style: AXIS_STYLE } : undefined}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
