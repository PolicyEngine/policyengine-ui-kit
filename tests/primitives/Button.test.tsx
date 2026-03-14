import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../../src/primitives/Button';

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('handles click events', () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('is disabled when disabled prop is set', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('accepts className override', () => {
    render(<Button className="bg-blue-500">Styled</Button>);
    expect(screen.getByRole('button').className).toContain('bg-blue-500');
  });

  it('accepts styles prop', () => {
    render(<Button styles={{ root: { maxWidth: '200px' } }}>Styled</Button>);
    expect(screen.getByRole('button')).toHaveStyle({ maxWidth: '200px' });
  });
});
