import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DashboardShell } from '../../src/layout/DashboardShell';
import { SidebarLayout } from '../../src/layout/SidebarLayout';
import { SingleColumnLayout } from '../../src/layout/SingleColumnLayout';
import { Header } from '../../src/layout/header';
import { InputPanel } from '../../src/layout/InputPanel';
import { ResultsPanel } from '../../src/layout/ResultsPanel';

describe('DashboardShell', () => {
  it('renders children', () => {
    render(<DashboardShell data-testid="shell">Hello</DashboardShell>);
    expect(screen.getByTestId('shell')).toHaveTextContent('Hello');
  });
});

describe('SidebarLayout', () => {
  it('renders sidebar and content', () => {
    render(
      <SidebarLayout sidebar={<div>Sidebar</div>}>
        <div>Content</div>
      </SidebarLayout>,
    );
    expect(screen.getByText('Sidebar')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });
});

describe('SingleColumnLayout', () => {
  it('renders content', () => {
    render(<SingleColumnLayout>Centered</SingleColumnLayout>);
    expect(screen.getByText('Centered')).toBeInTheDocument();
  });
});

describe('Header', () => {
  it('renders with nav items', () => {
    render(
      <Header
        navItems={[{ label: 'Home', href: '/' }]}
      />,
    );
    expect(screen.getByText('Home')).toBeInTheDocument();
  });
});

describe('InputPanel', () => {
  it('renders title and children', () => {
    render(<InputPanel title="Settings">Fields</InputPanel>);
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Fields')).toBeInTheDocument();
  });
});

describe('ResultsPanel', () => {
  it('renders children', () => {
    render(<ResultsPanel>Results</ResultsPanel>);
    expect(screen.getByText('Results')).toBeInTheDocument();
  });
});
