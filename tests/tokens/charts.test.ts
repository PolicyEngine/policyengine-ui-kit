import { describe, it, expect } from 'vitest';
import {
  chartColors,
  formatCurrency,
  formatPercent,
  formatNumber,
  getNiceTicks,
} from '../../src/tokens/charts';

describe('chartColors', () => {
  it('has primary color matching TEAL_PRIMARY', () => {
    expect(chartColors.primary).toBe('#319795');
  });

  it('has series array', () => {
    expect(chartColors.series.length).toBeGreaterThan(0);
  });
});

describe('formatCurrency', () => {
  it('formats billions', () => {
    expect(formatCurrency(1_500_000_000)).toBe('$1.5B');
  });

  it('formats millions', () => {
    expect(formatCurrency(2_300_000)).toBe('$2.3M');
  });

  it('formats thousands', () => {
    expect(formatCurrency(45_000)).toBe('$45K');
  });

  it('formats small values', () => {
    expect(formatCurrency(123)).toBe('$123');
  });
});

describe('formatPercent', () => {
  it('formats decimal as percentage', () => {
    expect(formatPercent(0.15)).toBe('15%');
  });

  it('supports decimals', () => {
    expect(formatPercent(0.156, 1)).toBe('15.6%');
  });
});

describe('getNiceTicks', () => {
  it('returns single value for equal domain', () => {
    expect(getNiceTicks([5, 5])).toEqual([5]);
  });

  it('returns nice tick values', () => {
    const ticks = getNiceTicks([0, 100], 5);
    expect(ticks.length).toBeGreaterThan(1);
    expect(ticks[0]).toBeLessThanOrEqual(0);
    expect(ticks[ticks.length - 1]).toBeGreaterThanOrEqual(100);
  });
});
