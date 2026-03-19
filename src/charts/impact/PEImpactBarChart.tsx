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
import { AXIS_STYLE, GRID_STYLE } from '../chartDefaults';
import { getImpactColors } from '../colorSemantics';
import { ImpactBarLabel } from '../ImpactBarLabel';
import { ImpactTooltip } from '../ImpactTooltip';
import { CHART_MARGINS, getNiceTicks, getYAxisLabelDx } from '../../utils/chartUtils';
import { cn } from '../../utils/cn';

export interface ImpactBarDatum {
  name: string;
  value: number;
  hoverText?: string;
}

export interface PEImpactBarChartProps {
  data: ImpactBarDatum[];
  height?: number;
  invertColors?: boolean;
  xAxisLabel?: string;
  yAxisLabel?: string;
  yTickFormatter?: (value: number) => string;
  yTicks?: number[];
  showBarLabels?: boolean;
  barLabelFormatter?: (value: number) => string;
  margin?: { top?: number; right?: number; bottom?: number; left?: number };
  className?: string;
  styles?: { root?: React.CSSProperties };
}

export function PEImpactBarChart({
  data,
  height = 400,
  invertColors = false,
  xAxisLabel,
  yAxisLabel,
  yTickFormatter,
  yTicks,
  showBarLabels = true,
  barLabelFormatter,
  margin = CHART_MARGINS.bar,
  className,
  styles,
}: PEImpactBarChartProps) {
  const colors = getImpactColors(invertColors);

  const values = data.map((d) => d.value);
  const minVal = Math.min(0, ...values);
  const maxVal = Math.max(0, ...values);
  const computedTicks = yTicks ?? getNiceTicks([minVal, maxVal], 5);
  const yLabelDx = yAxisLabel ? getYAxisLabelDx(computedTicks, yTickFormatter) : 0;

  return (
    <div className={cn('w-full', className)} style={styles?.root}>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={margin}>
          <CartesianGrid {...GRID_STYLE} vertical={false} />
          <XAxis
            dataKey="name"
            tick={AXIS_STYLE}
            tickLine={false}
            axisLine={{ stroke: 'var(--border)' }}
            label={xAxisLabel ? { value: xAxisLabel, position: 'insideBottom', offset: -5, style: AXIS_STYLE } : undefined}
          />
          <YAxis
            tick={AXIS_STYLE}
            tickLine={false}
            axisLine={{ stroke: 'var(--border)' }}
            ticks={computedTicks}
            tickFormatter={yTickFormatter}
            label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'center', dx: yLabelDx, style: AXIS_STYLE } : undefined}
          />
          <Tooltip
            content={<ImpactTooltip formatter={barLabelFormatter} />}
          />
          <Bar
            dataKey="value"
            radius={[4, 4, 0, 0]}
            isAnimationActive={false}
            label={
              showBarLabels
                ? (props: Record<string, unknown>) => (
                    <ImpactBarLabel
                      {...props}
                      value={props.value as number}
                      formatter={barLabelFormatter}
                    />
                  )
                : undefined
            }
          >
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={entry.value >= 0 ? colors.positive : colors.negative}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
