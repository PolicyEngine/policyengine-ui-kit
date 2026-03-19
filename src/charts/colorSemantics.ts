/**
 * Color semantics for PolicyEngine charts.
 *
 * Provides standardized color palettes for impact charts, winners/losers
 * visualizations, and diverging color scales for geographic maps.
 */

// --- Impact colors ---

/** Colors for positive/negative impact bars (e.g. budget, distributional) */
export const impactColors = {
  positive: 'var(--chart-1)',     // teal-500
  negative: 'var(--color-gray-600)',
  /** Inverted for metrics where decrease = good (poverty, inequality) */
  positiveInverted: 'var(--color-gray-600)',
  negativeInverted: 'var(--chart-1)',
} as const;

/** Select the correct positive/negative pair based on inversion */
export function getImpactColors(invertColors: boolean) {
  return invertColors
    ? { positive: impactColors.negativeInverted, negative: impactColors.positiveInverted }
    : { positive: impactColors.positive, negative: impactColors.negative };
}

// --- Winners/losers colors (5-segment scale) ---

export const winnersLosersColors = {
  /** Gain more than 5% */
  gain5: 'var(--color-teal-700)',
  /** Gain less than 5% */
  gain1: 'var(--primary-alpha-60)',
  /** No change (within ±1%) */
  noChange: 'var(--color-gray-200)',
  /** Lose less than 5% */
  lose1: 'var(--color-gray-400)',
  /** Lose more than 5% */
  lose5: 'var(--color-gray-600)',
  /** Ordered array for stacked bars (most positive → most negative) */
  scale: [
    'var(--color-teal-700)',
    'var(--primary-alpha-60)',
    'var(--color-gray-200)',
    'var(--color-gray-400)',
    'var(--color-gray-600)',
  ],
  /** Labels for the 5 segments */
  labels: [
    'Gain more than 5%',
    'Gain less than 5%',
    'No change',
    'Lose less than 5%',
    'Lose more than 5%',
  ],
} as const;

// --- Chart line colors ---

export const chartLineColors = {
  baseline: 'var(--color-gray-600)',
  reform: 'var(--chart-1)',
  baselineAlone: 'var(--color-gray-400)',
  areaFillOpacity: 0.3,
} as const;

// --- Diverging color scales (raw hex for canvas/SVG operations) ---

export const DIVERGING_GRAY_TEAL: readonly string[] = [
  '#4B5563', // gray-600
  '#9CA3AF', // gray-400
  '#E2E8F0', // gray-200
  '#81E6D9', // teal-200
  '#319795', // teal-500
];

export const DIVERGING_GRAY_BLUE: readonly string[] = [
  '#4B5563', // gray-600
  '#9CA3AF', // gray-400
  '#E2E8F0', // gray-200
  '#7DD3FC', // blue-300
  '#0EA5E9', // blue-500
];

const SCALES: Record<string, readonly string[]> = {
  'gray-teal': DIVERGING_GRAY_TEAL,
  'gray-blue': DIVERGING_GRAY_BLUE,
};

/** Get a named color scale. Defaults to gray-teal. */
export function getColorScale(name?: string): readonly string[] {
  return SCALES[name ?? 'gray-teal'] ?? DIVERGING_GRAY_TEAL;
}

// --- Color interpolation ---

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [
    parseInt(h.substring(0, 2), 16),
    parseInt(h.substring(2, 4), 16),
    parseInt(h.substring(4, 6), 16),
  ];
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    '#' +
    [r, g, b]
      .map((v) =>
        Math.round(Math.max(0, Math.min(255, v)))
          .toString(16)
          .padStart(2, '0'),
      )
      .join('')
  );
}

/**
 * Linearly interpolate a value within [min, max] across a color scale.
 * Returns a hex color string.
 */
export function interpolateColor(
  value: number,
  min: number,
  max: number,
  scaleColors: readonly string[] = DIVERGING_GRAY_TEAL,
): string {
  if (min === max) return scaleColors[Math.floor(scaleColors.length / 2)];
  const t = Math.max(0, Math.min(1, (value - min) / (max - min)));
  const segCount = scaleColors.length - 1;
  const segment = Math.min(Math.floor(t * segCount), segCount - 1);
  const segT = t * segCount - segment;

  const [r1, g1, b1] = hexToRgb(scaleColors[segment]);
  const [r2, g2, b2] = hexToRgb(scaleColors[segment + 1]);

  return rgbToHex(
    r1 + (r2 - r1) * segT,
    g1 + (g2 - g1) * segT,
    b1 + (b2 - b1) * segT,
  );
}
