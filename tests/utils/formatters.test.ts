import { describe, it, expect } from 'vitest';
import {
  formatCurrency,
  formatPercent,
  formatNumber,
  localeCode,
  currencyCode,
  currencySymbol,
  formatCurrencyAbbr,
  formatNumberAbbr,
  formatSignedPercent,
  ordinal,
  precision,
  formatPowers,
  formatParameterValue,
  formatCurrencyLocale,
  rechartsPercentFormatter,
} from '../../src/utils/formatters';

describe('formatCurrency', () => {
  it('formats billions', () => {
    expect(formatCurrency(1_500_000_000)).toBe('$1.5B');
  });
  it('formats millions', () => {
    expect(formatCurrency(2_300_000)).toBe('$2.3M');
  });
  it('formats thousands', () => {
    expect(formatCurrency(45_000)).toBe('$45K');
  });
  it('formats small values', () => {
    expect(formatCurrency(123)).toBe('$123');
  });
  it('formats negative values with leading minus', () => {
    expect(formatCurrency(-18_000)).toBe('-$18K');
  });
});

describe('formatPercent', () => {
  it('formats decimal as percentage', () => {
    expect(formatPercent(0.15)).toBe('15%');
  });
  it('supports decimals', () => {
    expect(formatPercent(0.156, 1)).toBe('15.6%');
  });
});

describe('locale lookups', () => {
  it('returns correct locale code', () => {
    expect(localeCode('us')).toBe('en-US');
    expect(localeCode('uk')).toBe('en-GB');
  });
  it('returns correct currency code', () => {
    expect(currencyCode('us')).toBe('USD');
    expect(currencyCode('uk')).toBe('GBP');
  });
  it('returns correct currency symbol', () => {
    expect(currencySymbol('us')).toBe('$');
    expect(currencySymbol('uk')).toBe('£');
  });
});

describe('formatCurrencyAbbr', () => {
  it('formats billions', () => {
    expect(formatCurrencyAbbr(1_200_000_000, 'us')).toBe('$1.2bn');
  });
  it('formats millions', () => {
    expect(formatCurrencyAbbr(3_500_000, 'uk')).toBe('£3.5m');
  });
  it('formats thousands', () => {
    expect(formatCurrencyAbbr(42_000, 'us')).toBe('$42.0k');
  });
  it('formats negative values', () => {
    expect(formatCurrencyAbbr(-500_000, 'us')).toBe('-$500.0k');
  });
});

describe('formatNumberAbbr', () => {
  it('formats billions', () => {
    expect(formatNumberAbbr(2_500_000_000)).toBe('2.5bn');
  });
  it('formats small values', () => {
    expect(formatNumberAbbr(42)).toBe('42');
  });
});

describe('formatSignedPercent', () => {
  it('adds plus for positive', () => {
    expect(formatSignedPercent(0.023, 1)).toBe('+2.3%');
  });
  it('keeps minus for negative', () => {
    expect(formatSignedPercent(-0.015, 1)).toBe('-1.5%');
  });
  it('shows zero without plus', () => {
    expect(formatSignedPercent(0, 1)).toBe('0.0%');
  });
});

describe('ordinal', () => {
  it('handles 1st, 2nd, 3rd', () => {
    expect(ordinal(1)).toBe('1st');
    expect(ordinal(2)).toBe('2nd');
    expect(ordinal(3)).toBe('3rd');
  });
  it('handles teens', () => {
    expect(ordinal(11)).toBe('11th');
    expect(ordinal(12)).toBe('12th');
    expect(ordinal(13)).toBe('13th');
  });
  it('handles regular th', () => {
    expect(ordinal(4)).toBe('4th');
    expect(ordinal(21)).toBe('21st');
  });
});

describe('precision', () => {
  it('detects zero decimals for integers', () => {
    expect(precision([1, 2, 3])).toBe(0);
  });
  it('detects decimals', () => {
    expect(precision([1.5, 2.25, 3])).toBe(2);
  });
  it('applies multiplier', () => {
    expect(precision([0.1, 0.2], 100)).toBe(0);
  });
});

describe('formatPowers', () => {
  it('formats billions', () => {
    const [coeff, suffix] = formatPowers(2_300_000_000);
    expect(coeff).toBeCloseTo(2.3);
    expect(suffix).toBe(' billion');
  });
  it('formats millions', () => {
    const [coeff, suffix] = formatPowers(5_000_000);
    expect(coeff).toBe(5);
    expect(suffix).toBe(' million');
  });
  it('returns raw for small values', () => {
    const [coeff, suffix] = formatPowers(42);
    expect(coeff).toBe(42);
    expect(suffix).toBe('');
  });
});

describe('formatParameterValue', () => {
  it('formats booleans', () => {
    expect(formatParameterValue(true, 'bool')).toBe('True');
    expect(formatParameterValue(false, 'bool')).toBe('False');
  });
  it('formats fractions as percent', () => {
    expect(formatParameterValue(0.5, '/1')).toBe('50.0%');
  });
});

describe('formatCurrencyLocale', () => {
  it('formats US dollars', () => {
    const result = formatCurrencyLocale(1234, 'us');
    expect(result).toContain('1,234');
    expect(result).toContain('$');
  });
});

describe('rechartsPercentFormatter', () => {
  it('returns a function', () => {
    const fmt = rechartsPercentFormatter(1);
    expect(typeof fmt).toBe('function');
    expect(fmt(0.5)).toBe('50.0%');
  });
  it('supports signed mode', () => {
    const fmt = rechartsPercentFormatter(1, true);
    expect(fmt(0.5)).toBe('+50.0%');
  });
});
