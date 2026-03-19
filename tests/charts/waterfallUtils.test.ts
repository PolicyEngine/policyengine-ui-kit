import { describe, it, expect } from 'vitest';
import {
  computeWaterfallData,
  getWaterfallDomain,
} from '../../src/charts/waterfallUtils';

describe('computeWaterfallData', () => {
  it('computes running totals correctly', () => {
    const items = [
      { name: 'A', value: 100 },
      { name: 'B', value: -30 },
      { name: 'C', value: 50 },
    ];
    const result = computeWaterfallData(items);
    expect(result[0].barBottom).toBe(0);
    expect(result[0].barTop).toBe(100);
    expect(result[1].barBottom).toBe(70);
    expect(result[1].barTop).toBe(100);
    expect(result[2].barBottom).toBe(70);
    expect(result[2].barTop).toBe(120);
  });

  it('handles total items correctly', () => {
    const items = [
      { name: 'A', value: 100 },
      { name: 'B', value: -30 },
      { name: 'Total', value: 0, isTotal: true },
    ];
    const result = computeWaterfallData(items);
    expect(result[2].value).toBe(70);
    expect(result[2].isTotal).toBe(true);
    expect(result[2].barBottom).toBe(0);
    expect(result[2].barTop).toBe(70);
  });

  it('applies formatter to values', () => {
    const items = [{ name: 'A', value: 100 }];
    const result = computeWaterfallData(items, (v) => `$${v}`);
    expect(result[0].formattedValue).toBe('$100');
  });
});

describe('getWaterfallDomain', () => {
  it('returns domain with padding', () => {
    const data = computeWaterfallData([
      { name: 'A', value: 100 },
      { name: 'B', value: -30 },
    ]);
    const [min, max] = getWaterfallDomain(data);
    expect(min).toBeLessThan(0);
    expect(max).toBeGreaterThan(100);
  });
});
