import { describe, it, expect } from 'vitest';
import { getNiceTicks, getClampedChartHeight, CHART_MARGINS } from '../../src/utils/chartUtils';

describe('getNiceTicks', () => {
  it('returns the single value when min equals max', () => {
    expect(getNiceTicks([5, 5])).toEqual([5]);
  });

  it('generates ticks spanning the domain', () => {
    const ticks = getNiceTicks([0, 100], 5);
    expect(ticks[0]).toBeLessThanOrEqual(0);
    expect(ticks[ticks.length - 1]).toBeGreaterThanOrEqual(100);
  });

  it('produces roughly the requested number of ticks', () => {
    const ticks = getNiceTicks([0, 1000], 5);
    expect(ticks.length).toBeGreaterThanOrEqual(3);
    expect(ticks.length).toBeLessThanOrEqual(12);
  });

  it('handles negative ranges', () => {
    const ticks = getNiceTicks([-50, 50], 5);
    expect(ticks[0]).toBeLessThanOrEqual(-50);
    expect(ticks[ticks.length - 1]).toBeGreaterThanOrEqual(50);
    expect(ticks).toContain(0);
  });

  it('handles small decimal ranges', () => {
    const ticks = getNiceTicks([0, 0.05], 5);
    expect(ticks[0]).toBeLessThanOrEqual(0);
    expect(ticks[ticks.length - 1]).toBeGreaterThanOrEqual(0.05);
  });
});

describe('getClampedChartHeight', () => {
  it('clamps mobile height to 250-400', () => {
    expect(getClampedChartHeight(200, true)).toBe(250);
    expect(getClampedChartHeight(1000, true)).toBe(400);
  });

  it('clamps desktop height to 400-700', () => {
    expect(getClampedChartHeight(200, false)).toBe(400);
    expect(getClampedChartHeight(2000, false)).toBe(700);
  });

  it('returns intermediate value for normal viewport', () => {
    const h = getClampedChartHeight(800, false);
    expect(h).toBeGreaterThanOrEqual(400);
    expect(h).toBeLessThanOrEqual(700);
  });
});

describe('CHART_MARGINS', () => {
  it('has margins for all chart types', () => {
    expect(CHART_MARGINS.bar).toBeDefined();
    expect(CHART_MARGINS.line).toBeDefined();
    expect(CHART_MARGINS.area).toBeDefined();
    expect(CHART_MARGINS.waterfall).toBeDefined();
  });
});
