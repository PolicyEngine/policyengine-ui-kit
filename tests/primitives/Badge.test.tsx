import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from '../../src/primitives/Badge';

describe('Badge', () => {
  it('renders text', () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('accepts className override', () => {
    render(<Badge className="bg-blue-500">Tag</Badge>);
    expect(screen.getByText('Tag').className).toContain('bg-blue-500');
  });
});
