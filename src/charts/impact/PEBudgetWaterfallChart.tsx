import type { CountryId } from '../../types/country';
import { PEWaterfallChart, type WaterfallItem, type WaterfallDatum } from '../PEWaterfallChart';
import { computeWaterfallData, getWaterfallDomain } from '../waterfallUtils';
import { chartColors } from '../chartDefaults';
import { getNiceTicks } from '../../utils/chartUtils';
import { formatCurrencyAbbr, currencySymbol } from '../../utils/formatters';


export interface PEBudgetWaterfallChartProps {
  data: WaterfallItem[];
  countryId?: CountryId;
  height?: number;
  fillHeight?: boolean;
  yLabel?: string;
  showBarLabels?: boolean;
  showConnectors?: boolean;
  className?: string;
  styles?: { root?: React.CSSProperties };
}

/**
 * Get fill color for a budget waterfall bar:
 * - Total: teal-700
 * - Positive (revenue): teal-500
 * - Negative (cost): gray-600
 */
export function getBudgetFillColor(item: { value: number; isTotal: boolean }): string {
  if (item.isTotal) return 'var(--chart-3)';
  return item.value >= 0 ? chartColors.primary : 'var(--color-gray-600)';
}

/**
 * Format a value in billions for budget charts.
 */
export function formatBillions(value: number, countryId: CountryId = 'us'): string {
  const sym = currencySymbol(countryId);
  const sign = value < 0 ? '-' : '';
  const abs = Math.abs(value);
  if (abs >= 1e9) {
    return `${sign}${sym}${(abs / 1e9).toFixed(1)}bn`;
  }
  return formatCurrencyAbbr(value, countryId);
}

/**
 * Create a tick formatter for budget waterfall Y-axis.
 */
export function makeBudgetTickFormatter(countryId: CountryId = 'us') {
  return (value: number) => formatBillions(value, countryId);
}

/**
 * Generate a budget chart title based on the total impact.
 */
export function getBudgetChartTitle(
  totalValue: number,
  countryId: CountryId = 'us',
): string {
  if (Math.abs(totalValue) < 0.01) {
    return 'This reform has no budgetary impact';
  }
  const direction = totalValue > 0 ? 'raises' : 'costs';
  return `This reform ${direction} ${formatBillions(Math.abs(totalValue), countryId)}`;
}

export function PEBudgetWaterfallChart({
  data: items,
  countryId = 'us',
  height = 400,
  fillHeight = false,
  yLabel = 'Budgetary impact (bn)',
  showBarLabels = true,
  showConnectors = true,
  className,
  styles,
}: PEBudgetWaterfallChartProps) {
  const tickFormatter = makeBudgetTickFormatter(countryId);
  const barLabelFormatter = (v: number) => formatBillions(v, countryId);

  const waterfallData = computeWaterfallData(items, barLabelFormatter);
  const yDomain = getWaterfallDomain(waterfallData);
  const yTicks = getNiceTicks(yDomain);

  return (
    <PEWaterfallChart
      data={waterfallData}
      yDomain={yDomain}
      height={height}
      fillHeight={fillHeight}
      fillColor={getBudgetFillColor}
      yLabel={yLabel}
      yTicks={yTicks}
      yTickFormatter={tickFormatter}
      formatTooltip={(v: number) => formatBillions(v, countryId)}
      showBarLabels={showBarLabels}
      barLabelFormatter={barLabelFormatter}
      showConnectors={showConnectors}
      className={className}
      styles={styles}
    />
  );
}
