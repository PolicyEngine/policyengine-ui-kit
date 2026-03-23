export const AXIS_STYLE = {
  fontFamily: 'var(--font-sans)',
  fontSize: 12,
  fill: 'var(--muted-foreground)',
};

export const GRID_STYLE = {
  stroke: 'var(--border)',
  strokeDasharray: '3 3',
};

export const TOOLTIP_STYLE = {
  contentStyle: {
    fontFamily: 'var(--font-sans)',
    fontSize: 13,
    backgroundColor: 'var(--background)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(16, 24, 40, 0.1)',
    padding: '8px 12px',
  },
  labelStyle: {
    fontWeight: 600,
    marginBottom: 4,
    color: 'var(--foreground)',
  },
  itemStyle: {
    color: 'var(--muted-foreground)',
    padding: '2px 0',
  },
};

export const LEGEND_STYLE = {
  wrapperStyle: {
    fontFamily: 'var(--font-sans)',
    fontSize: 13,
    color: 'var(--muted-foreground)',
    paddingTop: 8,
  },
};

export const chartColors = {
  primary: 'var(--chart-1)',
  secondary: 'var(--chart-2)',
  tertiary: 'var(--chart-3)',
  quaternary: 'var(--chart-4)',
  quinary: 'var(--chart-5)',
  positive: 'var(--success)',
  negative: 'var(--destructive)',
  series: [
    'var(--chart-1)',
    'var(--chart-2)',
    'var(--chart-3)',
    'var(--chart-4)',
    'var(--chart-5)',
  ],
} as const;

export const ZERO_LINE_STYLE = {
  stroke: 'var(--color-gray-600)',
  strokeWidth: 1,
} as const;

export const RECHARTS_FONT_STYLE = {
  fontFamily: 'var(--font-sans)',
  fontSize: 12,
  fill: 'var(--muted-foreground)',
} as const;

export const TOOLTIP_CONTAINER_STYLE: React.CSSProperties = {
  fontFamily: 'var(--font-sans)',
  fontSize: 13,
  backgroundColor: 'var(--background)',
  border: '1px solid var(--border)',
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(16, 24, 40, 0.1)',
  padding: '8px 12px',
  maxWidth: 'min(300px, 90vw)',
};

export const RECHARTS_WATERMARK = {
  text: 'PolicyEngine',
  style: {
    fontFamily: 'var(--font-sans)',
    fontSize: 10,
    fill: 'var(--color-gray-300)',
    textAnchor: 'end' as const,
  },
} as const;
