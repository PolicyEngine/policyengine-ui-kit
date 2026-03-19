import type { ChoroplethDataPoint, ColorRange, ChoroplethMapConfig, ColorScaleConfig } from './types';
import { interpolateColor, DIVERGING_GRAY_TEAL } from '../charts/colorSemantics';

/**
 * Apply hexagonal grid positioning offset for even/odd rows.
 */
export function applyHexagonalPositioning(
  x: number,
  y: number,
  hexSize: number,
): { px: number; py: number } {
  const hexWidth = hexSize * Math.sqrt(3);
  const hexHeight = hexSize * 2;
  const offsetX = y % 2 === 0 ? 0 : hexWidth / 2;
  return {
    px: x * hexWidth + offsetX,
    py: y * hexHeight * 0.75,
  };
}

/**
 * Calculate a symmetric range centered at zero.
 */
export function calculateSymmetricRange(values: number[]): ColorRange {
  if (values.length === 0) return { min: -1, max: 1 };
  const absMax = Math.max(...values.map(Math.abs));
  return { min: -absMax, max: absMax };
}

/**
 * Calculate color range (symmetric or asymmetric).
 */
export function calculateColorRange(
  values: number[],
  symmetric: boolean = true,
): ColorRange {
  if (values.length === 0) return { min: -1, max: 1 };
  if (symmetric) return calculateSymmetricRange(values);
  return { min: Math.min(...values), max: Math.max(...values) };
}

/**
 * Generate hover text for a data point.
 */
export function generateHoverText(
  label: string,
  value: number,
  formatter?: (v: number) => string,
): string {
  const formatted = formatter ? formatter(value) : value.toFixed(2);
  return `${label}: ${formatted}`;
}

/**
 * Create a map for efficient data lookup by ID.
 */
export function createDataLookupMap(
  data: ChoroplethDataPoint[],
): Map<string, ChoroplethDataPoint> {
  return new Map(data.map((d) => [d.geoId, d]));
}

/**
 * Get a color for a district value using interpolation.
 */
export function getDistrictColor(
  value: number | undefined,
  range: ColorRange,
  colors: readonly string[] = DIVERGING_GRAY_TEAL,
  defaultColor: string = '#E2E8F0',
): string {
  if (value == null) return defaultColor;
  return interpolateColor(value, range.min, range.max, colors);
}

/**
 * Merge partial config with defaults.
 */
export function mergeConfig<T extends Record<string, unknown>>(
  defaults: T,
  partial?: Partial<T>,
): T {
  if (!partial) return defaults;
  return { ...defaults, ...partial };
}

export const DEFAULT_CHOROPLETH_CONFIG: ChoroplethMapConfig = {
  width: 800,
  height: 500,
  colorScale: {
    colors: [...DIVERGING_GRAY_TEAL],
    symmetric: true,
  },
  defaultFill: '#E2E8F0',
  borderColor: '#FFFFFF',
  borderWidth: 0.5,
};

/**
 * US state abbreviation to FIPS code mapping.
 */
export const STATE_ABBREV_TO_FIPS: Record<string, string> = {
  AL: '01', AK: '02', AZ: '04', AR: '05', CA: '06',
  CO: '08', CT: '09', DE: '10', FL: '12', GA: '13',
  HI: '15', ID: '16', IL: '17', IN: '18', IA: '19',
  KS: '20', KY: '21', LA: '22', ME: '23', MD: '24',
  MA: '25', MI: '26', MN: '27', MS: '28', MO: '29',
  MT: '30', NE: '31', NV: '32', NH: '33', NJ: '34',
  NM: '35', NY: '36', NC: '37', ND: '38', OH: '39',
  OK: '40', OR: '41', PA: '42', RI: '44', SC: '45',
  SD: '46', TN: '47', TX: '48', UT: '49', VT: '50',
  VA: '51', WA: '53', WV: '54', WI: '55', WY: '56',
  DC: '11',
};
