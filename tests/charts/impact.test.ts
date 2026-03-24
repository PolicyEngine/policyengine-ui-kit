import { describe, it, expect } from 'vitest';
import {
  getBudgetFillColor,
  formatBillions,
  makeBudgetTickFormatter,
  getBudgetChartTitle,
} from '../../src/charts/impact/PEBudgetWaterfallChart';

describe('getBudgetFillColor', () => {
  it('returns total color for total items', () => {
    expect(getBudgetFillColor({ value: 100, isTotal: true })).toBe('var(--chart-3)');
  });

  it('returns primary for positive non-total items', () => {
    expect(getBudgetFillColor({ value: 100, isTotal: false })).toBe('var(--chart-1)');
  });

  it('returns gray for negative non-total items', () => {
    expect(getBudgetFillColor({ value: -50, isTotal: false })).toBe('var(--color-gray-600)');
  });
});

describe('formatBillions', () => {
  it('formats billions', () => {
    expect(formatBillions(1_200_000_000, 'us')).toBe('$1.2bn');
  });

  it('formats millions', () => {
    expect(formatBillions(500_000_000, 'us')).toBe('$500.0m');
  });

  it('handles UK currency', () => {
    expect(formatBillions(2_000_000_000, 'uk')).toBe('£2.0bn');
  });

  it('handles negative values', () => {
    expect(formatBillions(-3_000_000_000, 'us')).toBe('-$3.0bn');
  });
});

describe('makeBudgetTickFormatter', () => {
  it('returns a function', () => {
    const fmt = makeBudgetTickFormatter('us');
    expect(typeof fmt).toBe('function');
  });

  it('formats values', () => {
    const fmt = makeBudgetTickFormatter('us');
    expect(fmt(1_000_000_000)).toBe('$1.0bn');
  });
});

describe('getBudgetChartTitle', () => {
  it('returns raises message for positive', () => {
    const title = getBudgetChartTitle(5_000_000_000, 'us');
    expect(title).toContain('raises');
    expect(title).toContain('$5.0bn');
  });

  it('returns costs message for negative', () => {
    const title = getBudgetChartTitle(-2_000_000_000, 'us');
    expect(title).toContain('costs');
    expect(title).toContain('$2.0bn');
  });

  it('returns no impact for zero', () => {
    const title = getBudgetChartTitle(0);
    expect(title).toContain('no budgetary impact');
  });
});
