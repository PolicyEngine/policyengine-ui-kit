import { describe, it, expect } from 'vitest';
import {
  formatCurrency,
  formatPercent,
  formatNumber,
} from '../../src/utils/formatters';
import { chartColors } from '../../src/charts/chartDefaults';

describe('chartColors', () => {
  it('has primary color as CSS var', () => {
    expect(chartColors.primary).toBe('var(--chart-1)');
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
