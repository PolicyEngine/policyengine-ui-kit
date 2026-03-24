import { useState } from 'react';
import {
  LineChart,
  AreaChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceDot,
  ReferenceLine,
} from 'recharts';
import { AXIS_STYLE, GRID_STYLE, TOOLTIP_STYLE, LEGEND_STYLE, ZERO_LINE_STYLE } from '../chartDefaults';
import { chartLineColors } from '../colorSemantics';
import { CHART_MARGINS, getNiceTicks, getYAxisLayout } from '../../utils/chartUtils';
import { cn } from '../../utils/cn';

export type EarningsViewMode = 'both' | 'absolute' | 'relative';

export interface EarningsDatum {
  earnings: number;
  baseline: number;
  reform: number;
  difference?: number;
  relativeDifference?: number;
}

export interface PEEarningsChartProps {
  data: EarningsDatum[];
  currentEarnings?: number;
  defaultMode?: EarningsViewMode;
  xLabel?: string;
  yLabel?: string;
  xTickFormatter?: (value: number) => string;
  yTickFormatter?: (value: number) => string;
  height?: number;
  showModeToggle?: boolean;
  className?: string;
  styles?: { root?: React.CSSProperties };
}

export function PEEarningsChart({
  data,
  currentEarnings,
  defaultMode = 'both',
  xLabel = 'Earnings',
  yLabel,
  xTickFormatter,
  yTickFormatter,
  height = 400,
  showModeToggle = true,
  className,
  styles,
}: PEEarningsChartProps) {
  const [mode, setMode] = useState<EarningsViewMode>(defaultMode);

  const enrichedData = data.map((d) => ({
    ...d,
    difference: d.difference ?? d.reform - d.baseline,
    relativeDifference:
      d.relativeDifference ??
      (d.baseline !== 0 ? (d.reform - d.baseline) / d.baseline : 0),
  }));

  const refDot = currentEarnings != null
    ? enrichedData.find((d) => d.earnings === currentEarnings) ??
      enrichedData.reduce((prev, curr) =>
        Math.abs(curr.earnings - currentEarnings) < Math.abs(prev.earnings - currentEarnings)
          ? curr
          : prev,
      )
    : null;

  const margin = CHART_MARGINS.line;

  const allYValues = mode === 'both'
    ? enrichedData.flatMap((d) => [d.baseline, d.reform])
    : enrichedData.map((d) => mode === 'absolute' ? d.difference! : d.relativeDifference!);
  const computedTicks = getNiceTicks([Math.min(...allYValues), Math.max(...allYValues)], 5);
  const activeFormatter = mode === 'relative'
    ? (v: number) => `${(v * 100).toFixed(0)}%`
    : yTickFormatter;
  const yAxis = getYAxisLayout(computedTicks, !!yLabel, activeFormatter);
  const yLabelConfig = yLabel ? { value: yLabel, angle: -90, position: 'center' as const, dx: yAxis.labelDx, style: AXIS_STYLE } : undefined;
  const dynamicMargin = { ...margin, left: (margin.left ?? 0) + yAxis.marginLeft };

  return (
    <div className={cn('w-full', className)} style={styles?.root}>
      {showModeToggle && (
        <div className="flex gap-1 mb-3">
          {(['both', 'absolute', 'relative'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={cn(
                'px-3 py-1 text-xs rounded-md border transition-colors',
                mode === m
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-white text-muted-foreground border-border hover:bg-gray-50',
              )}
            >
              {m === 'both' ? 'Both lines' : m === 'absolute' ? 'Absolute diff' : 'Relative diff'}
            </button>
          ))}
        </div>
      )}

      <ResponsiveContainer width="100%" height={height}>
        {mode === 'both' ? (
          <LineChart data={enrichedData} margin={dynamicMargin}>
            <CartesianGrid {...GRID_STYLE} />
            <XAxis
              dataKey="earnings"
              tick={AXIS_STYLE}
              tickLine={false}
              axisLine={{ stroke: 'var(--border)' }}
              tickFormatter={xTickFormatter}
              label={xLabel ? { value: xLabel, position: 'insideBottom', offset: -5, style: AXIS_STYLE } : undefined}
            />
            <YAxis
              tick={AXIS_STYLE}
              tickLine={false}
              axisLine={{ stroke: 'var(--border)' }}
              width={yAxis.yAxisWidth}
              tickFormatter={yTickFormatter}
              label={yLabelConfig}
            />
            <Tooltip {...TOOLTIP_STYLE} />
            <Legend {...LEGEND_STYLE} />
            <Line
              type="monotone"
              dataKey="baseline"
              name="Baseline"
              stroke={chartLineColors.baseline}
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="reform"
              name="Reform"
              stroke={chartLineColors.reform}
              strokeWidth={2}
              dot={false}
            />
            {refDot && (
              <ReferenceDot
                x={refDot.earnings}
                y={refDot.reform}
                r={5}
                fill={chartLineColors.reform}
                stroke="white"
                strokeWidth={2}
              />
            )}
          </LineChart>
        ) : (
          <AreaChart data={enrichedData} margin={dynamicMargin}>
            <CartesianGrid {...GRID_STYLE} />
            <XAxis
              dataKey="earnings"
              tick={AXIS_STYLE}
              tickLine={false}
              axisLine={{ stroke: 'var(--border)' }}
              tickFormatter={xTickFormatter}
              label={xLabel ? { value: xLabel, position: 'insideBottom', offset: -5, style: AXIS_STYLE } : undefined}
            />
            <YAxis
              tick={AXIS_STYLE}
              tickLine={false}
              axisLine={{ stroke: 'var(--border)' }}
              width={yAxis.yAxisWidth}
              tickFormatter={
                mode === 'relative'
                  ? (v: number) => `${(v * 100).toFixed(0)}%`
                  : yTickFormatter
              }
              label={yLabelConfig}
            />
            <Tooltip {...TOOLTIP_STYLE} />
            <ReferenceLine y={0} {...ZERO_LINE_STYLE} />
            <Area
              type="monotone"
              dataKey={mode === 'absolute' ? 'difference' : 'relativeDifference'}
              name={mode === 'absolute' ? 'Absolute difference' : 'Relative difference'}
              stroke={chartLineColors.reform}
              fill={chartLineColors.reform}
              fillOpacity={chartLineColors.areaFillOpacity}
              strokeWidth={2}
            />
            {refDot && (
              <ReferenceDot
                x={refDot.earnings}
                y={
                  mode === 'absolute'
                    ? refDot.difference
                    : refDot.relativeDifference
                }
                r={5}
                fill={chartLineColors.reform}
                stroke="white"
                strokeWidth={2}
              />
            )}
          </AreaChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
