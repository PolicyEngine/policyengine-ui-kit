import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Sheet, SheetContent, SheetDescription, SheetTitle } from '../../src/primitives/Sheet';

function overlay() {
  return document.querySelector<HTMLElement>('[data-slot="sheet-overlay"]')!;
}

describe('SheetContent', () => {
  it('styles its overlay without passing the overlay props to the sheet', () => {
    render(
      <Sheet open>
        <SheetContent
          overlayClassName="custom-overlay"
          overlayStyle={{ zIndex: 1234 }}
          style={{ zIndex: 1235 }}
        >
          <SheetTitle>Title</SheetTitle>
          <SheetDescription>Description</SheetDescription>
        </SheetContent>
      </Sheet>,
    );

    expect(overlay()).toHaveClass('custom-overlay', 'fixed', 'inset-0', 'bg-black/50');
    expect(overlay().style.zIndex).toBe('1234');
    const sheet = screen.getByRole('dialog');
    expect(sheet.style.zIndex).toBe('1235');
    expect(sheet).not.toHaveClass('custom-overlay');
    expect(sheet).not.toHaveAttribute('overlayclassname');
    expect(sheet).not.toHaveAttribute('overlaystyle');
  });

  it('leaves the overlay as it was without them', () => {
    render(
      <Sheet open>
        <SheetContent>
          <SheetTitle>Title</SheetTitle>
          <SheetDescription>Description</SheetDescription>
        </SheetContent>
      </Sheet>,
    );

    expect(overlay()).toHaveClass('fixed', 'inset-0', 'z-50', 'bg-black/50');
    expect(overlay().getAttribute('style') ?? '').not.toMatch(/z-index/);
  });
});
