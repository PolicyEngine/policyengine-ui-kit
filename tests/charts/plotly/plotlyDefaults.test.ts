import { describe, it, expect } from 'vitest';
import {
  DEFAULT_CHART_CONFIG,
  CHART_FONT,
  DEFAULT_CHART_LAYOUT,
  getBaseChartLayout,
  getChartLogoImage,
} from '../../../src/charts/plotly/plotlyDefaults';

describe('DEFAULT_CHART_CONFIG', () => {
  it('disables mode bar', () => {
    expect(DEFAULT_CHART_CONFIG.displayModeBar).toBe(false);
  });

  it('is responsive', () => {
    expect(DEFAULT_CHART_CONFIG.responsive).toBe(true);
  });
});

describe('CHART_FONT', () => {
  it('uses Inter font', () => {
    expect(CHART_FONT.family).toContain('Inter');
  });

  it('has gray color', () => {
    expect(CHART_FONT.color).toBe('#6B7280');
  });
});

describe('DEFAULT_CHART_LAYOUT', () => {
  it('has transparent background', () => {
    expect(DEFAULT_CHART_LAYOUT.paper_bgcolor).toBe('transparent');
    expect(DEFAULT_CHART_LAYOUT.plot_bgcolor).toBe('transparent');
  });
});

describe('getBaseChartLayout', () => {
  it('returns smaller font on mobile', () => {
    const mobile = getBaseChartLayout(true);
    const desktop = getBaseChartLayout(false);
    expect(mobile.font.size).toBeLessThan(desktop.font.size);
  });

  it('returns smaller margins on mobile', () => {
    const mobile = getBaseChartLayout(true);
    const desktop = getBaseChartLayout(false);
    expect(mobile.margin.l).toBeLessThan(desktop.margin.l);
  });
});

describe('getChartLogoImage', () => {
  it('returns an image object', () => {
    const img = getChartLogoImage();
    expect(img.xref).toBe('paper');
    expect(img.yref).toBe('paper');
  });

  it('accepts custom options', () => {
    const img = getChartLogoImage({ opacity: 0.3 });
    expect(img.opacity).toBe(0.3);
  });
});
