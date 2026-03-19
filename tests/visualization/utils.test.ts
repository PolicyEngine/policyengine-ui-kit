import { describe, it, expect } from 'vitest';
import {
  applyHexagonalPositioning,
  calculateSymmetricRange,
  calculateColorRange,
  generateHoverText,
  createDataLookupMap,
  getDistrictColor,
  mergeConfig,
  STATE_ABBREV_TO_FIPS,
} from '../../src/visualization/utils';

describe('applyHexagonalPositioning', () => {
  it('returns positioned coordinates', () => {
    const { px, py } = applyHexagonalPositioning(0, 0, 30);
    expect(px).toBeCloseTo(0);
    expect(py).toBeCloseTo(0);
  });

  it('offsets odd rows', () => {
    const even = applyHexagonalPositioning(1, 0, 30);
    const odd = applyHexagonalPositioning(1, 1, 30);
    expect(odd.px).not.toBe(even.px);
  });
});

describe('calculateSymmetricRange', () => {
  it('returns symmetric range centered at zero', () => {
    const range = calculateSymmetricRange([-3, 5, -1]);
    expect(range.min).toBe(-5);
    expect(range.max).toBe(5);
  });

  it('returns default for empty array', () => {
    const range = calculateSymmetricRange([]);
    expect(range.min).toBe(-1);
    expect(range.max).toBe(1);
  });
});

describe('calculateColorRange', () => {
  it('returns symmetric range by default', () => {
    const range = calculateColorRange([2, -3]);
    expect(range.min).toBe(-3);
    expect(range.max).toBe(3);
  });

  it('returns asymmetric range when specified', () => {
    const range = calculateColorRange([2, -3], false);
    expect(range.min).toBe(-3);
    expect(range.max).toBe(2);
  });
});

describe('generateHoverText', () => {
  it('generates text with label and value', () => {
    const text = generateHoverText('District 1', 0.5);
    expect(text).toContain('District 1');
    expect(text).toContain('0.50');
  });

  it('uses custom formatter', () => {
    const text = generateHoverText('Test', 42, (v) => `$${v}`);
    expect(text).toBe('Test: $42');
  });
});

describe('createDataLookupMap', () => {
  it('creates a map from data points', () => {
    const data = [
      { geoId: 'a', label: 'A', value: 1 },
      { geoId: 'b', label: 'B', value: 2 },
    ];
    const map = createDataLookupMap(data);
    expect(map.get('a')?.value).toBe(1);
    expect(map.get('b')?.value).toBe(2);
  });
});

describe('getDistrictColor', () => {
  it('returns interpolated color for known value', () => {
    const color = getDistrictColor(0.5, { min: 0, max: 1 });
    expect(color).toMatch(/^#[0-9a-f]{6}$/);
  });

  it('returns default for undefined value', () => {
    const color = getDistrictColor(undefined, { min: 0, max: 1 });
    expect(color).toBe('#E2E8F0');
  });
});

describe('mergeConfig', () => {
  it('merges partial config', () => {
    const defaults = { a: 1, b: 2 };
    const result = mergeConfig(defaults, { b: 3 });
    expect(result).toEqual({ a: 1, b: 3 });
  });

  it('returns defaults when partial is undefined', () => {
    const defaults = { a: 1 };
    expect(mergeConfig(defaults)).toEqual({ a: 1 });
  });
});

describe('STATE_ABBREV_TO_FIPS', () => {
  it('maps CA to 06', () => {
    expect(STATE_ABBREV_TO_FIPS['CA']).toBe('06');
  });

  it('maps NY to 36', () => {
    expect(STATE_ABBREV_TO_FIPS['NY']).toBe('36');
  });
});
