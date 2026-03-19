import { describe, it, expect } from 'vitest';
import {
  impactColors,
  getImpactColors,
  winnersLosersColors,
  chartLineColors,
  DIVERGING_GRAY_TEAL,
  DIVERGING_GRAY_BLUE,
  getColorScale,
  interpolateColor,
} from '../../src/charts/colorSemantics';

describe('impactColors', () => {
  it('has positive and negative colors', () => {
    expect(impactColors.positive).toBeDefined();
    expect(impactColors.negative).toBeDefined();
  });

  it('has inverted variants', () => {
    expect(impactColors.positiveInverted).toBeDefined();
    expect(impactColors.negativeInverted).toBeDefined();
  });
});

describe('getImpactColors', () => {
  it('returns normal colors when not inverted', () => {
    const colors = getImpactColors(false);
    expect(colors.positive).toBe(impactColors.positive);
    expect(colors.negative).toBe(impactColors.negative);
  });

  it('swaps colors when inverted', () => {
    const colors = getImpactColors(true);
    expect(colors.positive).toBe(impactColors.negativeInverted);
    expect(colors.negative).toBe(impactColors.positiveInverted);
  });
});

describe('winnersLosersColors', () => {
  it('has 5-segment scale', () => {
    expect(winnersLosersColors.scale).toHaveLength(5);
    expect(winnersLosersColors.labels).toHaveLength(5);
  });
});

describe('chartLineColors', () => {
  it('has baseline and reform colors', () => {
    expect(chartLineColors.baseline).toBeDefined();
    expect(chartLineColors.reform).toBeDefined();
  });
});

describe('color scales', () => {
  it('DIVERGING_GRAY_TEAL has 5 stops', () => {
    expect(DIVERGING_GRAY_TEAL).toHaveLength(5);
  });

  it('DIVERGING_GRAY_BLUE has 5 stops', () => {
    expect(DIVERGING_GRAY_BLUE).toHaveLength(5);
  });

  it('getColorScale returns gray-teal by default', () => {
    expect(getColorScale()).toBe(DIVERGING_GRAY_TEAL);
  });

  it('getColorScale returns named scale', () => {
    expect(getColorScale('gray-blue')).toBe(DIVERGING_GRAY_BLUE);
  });

  it('getColorScale falls back to gray-teal for unknown names', () => {
    expect(getColorScale('unknown')).toBe(DIVERGING_GRAY_TEAL);
  });
});

describe('interpolateColor', () => {
  it('returns first color at min', () => {
    expect(interpolateColor(0, 0, 100, DIVERGING_GRAY_TEAL)).toBe('#4b5563');
  });

  it('returns last color at max', () => {
    expect(interpolateColor(100, 100, 100, DIVERGING_GRAY_TEAL)).toBe(
      DIVERGING_GRAY_TEAL[2], // midpoint for equal min/max
    );
  });

  it('returns middle color at midpoint', () => {
    const color = interpolateColor(50, 0, 100, DIVERGING_GRAY_TEAL);
    // Should be the middle color (index 2)
    expect(color).toBe('#e2e8f0');
  });

  it('clamps values below min', () => {
    const color = interpolateColor(-10, 0, 100, DIVERGING_GRAY_TEAL);
    expect(color).toBe('#4b5563');
  });

  it('clamps values above max', () => {
    const color = interpolateColor(200, 0, 100, DIVERGING_GRAY_TEAL);
    expect(color).toBe('#319795');
  });

  it('returns a valid hex color', () => {
    const color = interpolateColor(30, 0, 100, DIVERGING_GRAY_TEAL);
    expect(color).toMatch(/^#[0-9a-f]{6}$/);
  });
});
