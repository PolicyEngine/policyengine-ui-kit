/**
 * Default Plotly configuration and layout settings for PolicyEngine charts.
 *
 * These are provided as plain objects — consumers using react-plotly.js can
 * spread them into their <Plot> components.
 */

export const DEFAULT_CHART_CONFIG = {
  displayModeBar: false,
  responsive: true,
} as const;

export const CHART_FONT = {
  family: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  size: 12,
  color: '#6B7280',
} as const;

export const DEFAULT_CHART_LAYOUT = {
  font: CHART_FONT,
  paper_bgcolor: 'transparent',
  plot_bgcolor: 'transparent',
  margin: { t: 20, r: 20, b: 40, l: 60 },
  xaxis: {
    gridcolor: '#E2E8F0',
    gridwidth: 1,
    zeroline: false,
  },
  yaxis: {
    gridcolor: '#E2E8F0',
    gridwidth: 1,
    zeroline: false,
  },
} as const;

/**
 * Get a Plotly layout with mobile-aware margins and font sizes.
 */
export function getBaseChartLayout(mobile: boolean = false) {
  return {
    ...DEFAULT_CHART_LAYOUT,
    font: {
      ...CHART_FONT,
      size: mobile ? 10 : 12,
    },
    margin: mobile
      ? { t: 10, r: 10, b: 30, l: 40 }
      : { t: 20, r: 20, b: 40, l: 60 },
  };
}

/**
 * Get a Plotly images array element for the PolicyEngine logo watermark.
 */
export function getChartLogoImage(options?: {
  opacity?: number;
  x?: number;
  y?: number;
  sizex?: number;
  sizey?: number;
  logoUrl?: string;
}) {
  return {
    source: options?.logoUrl ?? '',
    xref: 'paper' as const,
    yref: 'paper' as const,
    x: options?.x ?? 1,
    y: options?.y ?? -0.15,
    sizex: options?.sizex ?? 0.1,
    sizey: options?.sizey ?? 0.1,
    xanchor: 'right' as const,
    yanchor: 'bottom' as const,
    opacity: options?.opacity ?? 0.5,
  };
}
