import { describe, it, expect } from 'vitest';
import { colors, TEAL_PRIMARY, TEAL_ACCENT } from '../../src/tokens/colors';

describe('colors', () => {
  it('exports TEAL_PRIMARY as primary-500', () => {
    expect(TEAL_PRIMARY).toBe('#319795');
    expect(colors.primary[500]).toBe(TEAL_PRIMARY);
  });

  it('exports TEAL_ACCENT', () => {
    expect(TEAL_ACCENT).toBe('#39C6C0');
  });

  it('has complete primary scale', () => {
    expect(colors.primary[50]).toBeDefined();
    expect(colors.primary[900]).toBeDefined();
  });

  it('has semantic colors', () => {
    expect(colors.success).toBe('#22C55E');
    expect(colors.warning).toBe('#FEC601');
    expect(colors.error).toBe('#EF4444');
    expect(colors.info).toBe('#1890FF');
  });

  it('has text colors', () => {
    expect(colors.text.primary).toBe('#000000');
    expect(colors.text.secondary).toBe('#5A5A5A');
  });

  it('has border colors', () => {
    expect(colors.border.light).toBe('#E2E8F0');
    expect(colors.border.medium).toBe('#CBD5E1');
  });
});
