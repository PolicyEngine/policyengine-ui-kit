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
import { colors } from '../tokens/colors';
import { AXIS_STYLE, GRID_STYLE, TOOLTIP_STYLE, LEGEND_STYLE, chartColors } from './chartDefaults';
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
  formatTooltip,
  className,
  styles,
  rechartsProps,
}: PEAreaChartProps) {
  return (
    <div className={cn('w-full', className)} style={styles?.root}>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} {...rechartsProps}>
          {showGrid && <CartesianGrid {...GRID_STYLE} />}
          <XAxis
            dataKey={xKey}
            tick={AXIS_STYLE}
            tickLine={false}
            axisLine={{ stroke: colors.border.light }}
            label={xLabel ? { value: xLabel, position: 'insideBottom', offset: -5, style: AXIS_STYLE } : undefined}
          />
          <YAxis
            tick={AXIS_STYLE}
            tickLine={false}
            axisLine={{ stroke: colors.border.light }}
            label={yLabel ? { value: yLabel, angle: -90, position: 'insideLeft', offset: 10, style: AXIS_STYLE } : undefined}
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
