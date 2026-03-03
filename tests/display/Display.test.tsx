import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MetricCard } from '../../src/display/MetricCard';
import { SummaryText } from '../../src/display/SummaryText';
import { DataTable } from '../../src/display/DataTable';
import { PolicyEngineWatermark } from '../../src/display/PolicyEngineWatermark';

describe('MetricCard', () => {
  it('renders label and string value', () => {
    render(<MetricCard label="Revenue" value="$1.2M" />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByText('$1.2M')).toBeInTheDocument();
  });

  it('formats currency value', () => {
    render(<MetricCard label="Cost" value={2500000} format="currency" />);
    expect(screen.getByText('$2.5M')).toBeInTheDocument();
  });

  it('shows trend indicator', () => {
    render(<MetricCard label="Growth" value="12%" trend="positive" delta="+5%" />);
    expect(screen.getByText(/\+5%/)).toBeInTheDocument();
  });
});

describe('SummaryText', () => {
  it('renders text', () => {
    render(<SummaryText>This reform would save $100.</SummaryText>);
    expect(screen.getByText('This reform would save $100.')).toBeInTheDocument();
  });
});

describe('DataTable', () => {
  it('renders headers and data', () => {
    const columns = [
      { key: 'name', header: 'Name' },
      { key: 'value', header: 'Value' },
    ];
    const data = [
      { name: 'Income', value: '$50,000' },
      { name: 'Tax', value: '$10,000' },
    ];
    render(<DataTable columns={columns} data={data} />);
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Income')).toBeInTheDocument();
    expect(screen.getByText('$50,000')).toBeInTheDocument();
  });
});

describe('PolicyEngineWatermark', () => {
  it('renders text', () => {
    render(<PolicyEngineWatermark />);
    expect(screen.getByText('PolicyEngine')).toBeInTheDocument();
  });
});
