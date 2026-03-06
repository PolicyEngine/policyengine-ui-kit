import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { AXIS_STYLE, GRID_STYLE, TOOLTIP_STYLE, chartColors } from './chartDefaults';
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
  showGrid?: boolean;
  formatTooltip?: (value: number) => string;
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
}

function buildWaterfallData(
  items: WaterfallItem[],
  positiveColor: string,
  negativeColor: string,
  totalColor: string,
): WaterfallDatum[] {
  let running = 0;
  return items.map((item) => {
    if (item.isTotal) {
      const start = 0;
      const end = running;
      return {
        name: item.name,
        value: running,
        base: Math.min(start, end),
        range: [Math.min(start, end), Math.max(start, end)],
        fill: totalColor,
      };
    }
    const start = running;
    running += item.value;
    const end = running;
    return {
      name: item.name,
      value: item.value,
      base: Math.min(start, end),
      range: [Math.min(start, end), Math.max(start, end)],
      fill: item.value >= 0 ? positiveColor : negativeColor,
    };
  });
}

export function PEWaterfallChart({
  data,
  height = 400,
  positiveColor = chartColors.primary,
  negativeColor = 'var(--gray-600)',
  totalColor = 'var(--chart-3)',
  showGrid = true,
  formatTooltip,
  className,
  styles,
  rechartsProps,
}: PEWaterfallChartProps) {
  const waterfallData = buildWaterfallData(data, positiveColor, negativeColor, totalColor);

  return (
    <div className={cn('w-full', className)} style={styles?.root}>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={waterfallData} {...rechartsProps}>
          {showGrid && <CartesianGrid {...GRID_STYLE} />}
          <XAxis
            dataKey="name"
            tick={AXIS_STYLE}
            tickLine={false}
            axisLine={{ stroke: 'var(--border)' }}
          />
          <YAxis
            tick={AXIS_STYLE}
            tickLine={false}
            axisLine={{ stroke: 'var(--border)' }}
          />
          <Tooltip
            {...TOOLTIP_STYLE}
            formatter={(v: unknown, name: string) => {
              if (name === 'base') return [null, null];
              const val = v as number;
              return formatTooltip ? [formatTooltip(val)] : [val];
            }}
          />
          <Bar dataKey="base" stackId="waterfall" fill="transparent" />
          <Bar dataKey="value" stackId="waterfall" radius={[4, 4, 0, 0]}>
            {waterfallData.map((entry, index) => (
              <Cell key={index} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
