import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChartContainer } from '../../src/charts/ChartContainer';

// Recharts components need ResizeObserver which isn't in jsdom,
// so we only smoke-test ChartContainer and verify chart defaults.

describe('ChartContainer', () => {
  it('renders title and children', () => {
    render(
      <ChartContainer title="Revenue over time">
        <div>Chart goes here</div>
      </ChartContainer>,
    );
    expect(screen.getByText('Revenue over time')).toBeInTheDocument();
    expect(screen.getByText('Chart goes here')).toBeInTheDocument();
  });

  it('renders subtitle', () => {
    render(
      <ChartContainer title="Budget" subtitle="FY 2025">
        <div />
      </ChartContainer>,
    );
    expect(screen.getByText('FY 2025')).toBeInTheDocument();
  });

  it('renders actions slot', () => {
    render(
      <ChartContainer actions={<button>Download</button>}>
        <div />
      </ChartContainer>,
    );
    expect(screen.getByText('Download')).toBeInTheDocument();
  });
});

describe('chartDefaults', () => {
  it('exports axis and grid styles', async () => {
    const { AXIS_STYLE, GRID_STYLE, TOOLTIP_STYLE } = await import(
      '../../src/charts/chartDefaults'
    );
    expect(AXIS_STYLE.fontFamily).toContain('Inter');
    expect(GRID_STYLE.stroke).toBeDefined();
    expect(TOOLTIP_STYLE.contentStyle.borderRadius).toBe('8px');
  });
});
