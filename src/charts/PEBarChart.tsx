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
} from 'recharts';
import { colors } from '../tokens/colors';
import { AXIS_STYLE, GRID_STYLE, TOOLTIP_STYLE, LEGEND_STYLE, chartColors } from './chartDefaults';
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
  negativeColor = colors.gray[600],
  fillColor = chartColors.primary,
  showGrid = true,
  showLegend = false,
  xLabel,
  yLabel,
  formatTooltip,
  className,
  styles,
  rechartsProps,
}: PEBarChartProps) {
  return (
    <div className={cn('tw:w-full', className)} style={styles?.root}>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} {...rechartsProps}>
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
          <Bar dataKey={yKey} radius={[4, 4, 0, 0]}>
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
