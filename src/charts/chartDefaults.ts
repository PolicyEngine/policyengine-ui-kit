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

/** @deprecated Use AXIS_STYLE instead — identical values. */
export const RECHARTS_FONT_STYLE = AXIS_STYLE;

export const TOOLTIP_CONTAINER_STYLE: React.CSSProperties = {
  ...TOOLTIP_STYLE.contentStyle,
  maxWidth: 'min(300px, 90vw)',
};
