/**
 * Chart utility functions for axis ticks, sizing, margins, and data export.
 */

// --- Nice tick generation (D3-style) ---

const NICE_STEPS = [1, 2, 2.5, 5, 10];

/**
 * Generate "nice" tick values for a chart axis.
 * Uses the D3 nice-numbers algorithm with step multiples [1, 2, 2.5, 5, 10].
 */
export function getNiceTicks(
  domain: [number, number],
  count: number = 5,
): number[] {
  const [rawMin, rawMax] = domain;
  if (rawMin === rawMax) return [rawMin];

  const range = rawMax - rawMin;
  const roughStep = range / (count - 1);
  const magnitude = Math.pow(10, Math.floor(Math.log10(roughStep)));
  const normalized = roughStep / magnitude;

  let niceStep = magnitude;
  for (const s of NICE_STEPS) {
    if (normalized <= s) {
      niceStep = s * magnitude;
      break;
    }
  }

  const niceMin = Math.floor(rawMin / niceStep) * niceStep;
  const niceMax = Math.ceil(rawMax / niceStep) * niceStep;

  const ticks: number[] = [];
  for (let v = niceMin; v <= niceMax + niceStep * 0.01; v += niceStep) {
    ticks.push(parseFloat(v.toPrecision(12)));
  }
  return ticks;
}

// --- Clamped chart height ---

/**
 * Calculate responsive chart height clamped to sensible bounds.
 * Mobile: 250–400px, Desktop: 400–700px.
 */
export function getClampedChartHeight(
  viewportHeight: number,
  isMobile: boolean = false,
): number {
  if (isMobile) {
    return Math.max(250, Math.min(400, viewportHeight * 0.45));
  }
  return Math.max(400, Math.min(700, viewportHeight * 0.55));
}

// --- Default chart margins (left is minimal; use getYAxisLayout for dynamic left) ---

export const CHART_MARGINS = {
  bar: { top: 20, right: 20, bottom: 20, left: 0 },
  line: { top: 20, right: 20, bottom: 20, left: 0 },
  area: { top: 20, right: 20, bottom: 20, left: 0 },
  waterfall: { top: 20, right: 20, bottom: 40, left: 0 },
} as const;

// --- Y-axis layout (dynamic width, margin, and label offset) ---

const AXIS_FONT = '12px Inter, system-ui, sans-serif';
const Y_LABEL_FONT_SIZE = 12; // matches AXIS_STYLE fontSize
const TICK_PADDING = 4;

/**
 * Measure tick label widths and compute the YAxis width, left margin,
 * and label dx so nothing clips and there's no wasted space.
 *
 * - yAxisWidth: set as the `width` prop on `<YAxis>`
 * - marginLeft: set as `margin.left` on the chart
 * - labelDx: set as `dx` on the YAxis label
 */
export function getYAxisLayout(
  ticks: number[],
  hasLabel: boolean,
  formatter?: (value: number) => string,
): { yAxisWidth: number; marginLeft: number; labelDx: number } {
  const fallbackTickWidth = 30;

  let maxTickWidth = fallbackTickWidth;
  if (typeof document !== 'undefined' && ticks.length > 0) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.font = AXIS_FONT;
      const labels = ticks.map((t) => (formatter ? formatter(t) : String(t)));
      maxTickWidth = Math.max(...labels.map((l) => ctx.measureText(l).width));
    }
  }

  // YAxis width = tick labels + padding so they don't clip
  const yAxisWidth = Math.ceil(maxTickWidth) + TICK_PADDING + 4;

  // Base margin ensures left-most tick text isn't clipped by SVG edge;
  // add extra space for a rotated axis label when present
  const BASE_MARGIN = 4;
  const marginLeft = hasLabel ? Y_LABEL_FONT_SIZE + 20 + BASE_MARGIN : BASE_MARGIN;

  // Position the label to the left of the tick labels with breathing room
  const LABEL_GAP = 16;
  const labelDx = -(Math.ceil(maxTickWidth) / 2 + TICK_PADDING + LABEL_GAP);

  return { yAxisWidth, marginLeft, labelDx };
}

/** @deprecated Use getYAxisLayout instead */
export function getYAxisLabelDx(
  ticks: number[],
  formatter?: (value: number) => string,
): number {
  return getYAxisLayout(ticks, true, formatter).labelDx;
}

// --- CSV download ---

/**
 * Download an array of objects as a CSV file.
 */
export function downloadCsv(
  data: Record<string, unknown>[],
  filename: string = 'chart-data.csv',
): void {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const rows = data.map((row) =>
    headers
      .map((h) => {
        const val = row[h];
        const str = val == null ? '' : String(val);
        return str.includes(',') || str.includes('"') || str.includes('\n')
          ? `"${str.replace(/"/g, '""')}"`
          : str;
      })
      .join(','),
  );

  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
