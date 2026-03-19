/**
 * Waterfall chart data transformation utilities.
 * Converts simple value arrays into range-bar data for Recharts.
 */

export interface WaterfallInputItem {
  name: string;
  value: number;
  isTotal?: boolean;
}

export interface WaterfallComputedItem {
  name: string;
  value: number;
  barBottom: number;
  barTop: number;
  isTotal: boolean;
  formattedValue?: string;
}

/**
 * Compute waterfall chart data with barBottom/barTop for range bars.
 */
export function computeWaterfallData(
  items: WaterfallInputItem[],
  formatValue?: (value: number) => string,
): WaterfallComputedItem[] {
  let running = 0;

  return items.map((item) => {
    if (item.isTotal) {
      return {
        name: item.name,
        value: running,
        barBottom: Math.min(0, running),
        barTop: Math.max(0, running),
        isTotal: true,
        formattedValue: formatValue ? formatValue(running) : undefined,
      };
    }

    const start = running;
    running += item.value;

    return {
      name: item.name,
      value: item.value,
      barBottom: Math.min(start, running),
      barTop: Math.max(start, running),
      isTotal: false,
      formattedValue: formatValue ? formatValue(item.value) : undefined,
    };
  });
}

/**
 * Calculate Y-axis domain for waterfall chart with 10% padding.
 */
export function getWaterfallDomain(
  data: WaterfallComputedItem[],
): [number, number] {
  let min = 0;
  let max = 0;

  for (const item of data) {
    min = Math.min(min, item.barBottom);
    max = Math.max(max, item.barTop);
  }

  const padding = (max - min) * 0.1;
  return [min - padding, max + padding];
}
