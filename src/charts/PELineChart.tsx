import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { AXIS_STYLE, GRID_STYLE, TOOLTIP_STYLE, LEGEND_STYLE, chartColors } from './chartDefaults';
import { cn } from '../utils/cn';

export interface PELineChartSeries {
  dataKey: string;
  name?: string;
  color?: string;
  strokeDasharray?: string;
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
  formatTooltip,
  className,
  styles,
  rechartsProps,
}: PELineChartProps) {
  return (
    <div className={cn('w-full', className)} style={styles?.root}>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} {...rechartsProps}>
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
            label={yLabel ? { value: yLabel, angle: -90, position: 'insideLeft', offset: 10, style: AXIS_STYLE } : undefined}
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
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
