import { describe, it, expect } from 'vitest';
import { typography, FONT_UI, FONT_MONO } from '../../src/tokens/typography';

describe('typography', () => {
  it('uses Inter as primary font', () => {
    expect(typography.fontFamily.primary).toContain('Inter');
    expect(FONT_UI).toBe(typography.fontFamily.primary);
  });

  it('uses JetBrains Mono for code', () => {
    expect(typography.fontFamily.mono).toContain('JetBrains Mono');
    expect(FONT_MONO).toBe(typography.fontFamily.mono);
  });

  it('has font weight scale', () => {
    expect(typography.fontWeight.normal).toBe(400);
    expect(typography.fontWeight.semibold).toBe(600);
    expect(typography.fontWeight.bold).toBe(700);
  });

  it('has font size scale', () => {
    expect(typography.fontSize.sm).toBe('14px');
    expect(typography.fontSize.base).toBe('16px');
  });
});
