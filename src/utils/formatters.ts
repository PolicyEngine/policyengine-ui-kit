import type { CountryId } from '../types/country';

// --- Locale / currency lookup tables ---

const LOCALE_MAP: Record<CountryId, string> = {
  us: 'en-US',
  uk: 'en-GB',
  ca: 'en-CA',
  ng: 'en-NG',
  il: 'he-IL',
};

const CURRENCY_MAP: Record<CountryId, string> = {
  us: 'USD',
  uk: 'GBP',
  ca: 'CAD',
  ng: 'NGN',
  il: 'ILS',
};

const SYMBOL_MAP: Record<CountryId, string> = {
  us: '$',
  uk: '£',
  ca: 'C$',
  ng: '₦',
  il: '₪',
};

export function localeCode(countryId: CountryId): string {
  return LOCALE_MAP[countryId];
}

export function currencyCode(countryId: CountryId): string {
  return CURRENCY_MAP[countryId];
}

export function currencySymbol(countryId: CountryId): string {
  return SYMBOL_MAP[countryId];
}

// --- Existing simple formatters ---

/**
 * Currency formatter for chart axis labels (USD, abbreviated)
 */
export function formatCurrency(value: number): string {
  const sign = value < 0 ? '-' : '';
  const abs = Math.abs(value);
  if (abs >= 1e9) {
    return `${sign}$${(abs / 1e9).toFixed(1)}B`;
  }
  if (abs >= 1e6) {
    return `${sign}$${(abs / 1e6).toFixed(1)}M`;
  }
  if (abs >= 1e3) {
    return `${sign}$${(abs / 1e3).toFixed(0)}K`;
  }
  return `${sign}$${abs.toFixed(0)}`;
}

/**
 * Percentage formatter for chart axis labels
 */
export function formatPercent(value: number, decimals: number = 0): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Number formatter for chart axis labels
 */
export function formatNumber(value: number): string {
  return value.toLocaleString();
}

// --- Locale-aware formatters ---

export interface FormatOptions {
  decimals?: number;
  compact?: boolean;
}

/**
 * Format a currency value using Intl.NumberFormat for the given country.
 */
export function formatCurrencyLocale(
  value: number,
  countryId: CountryId,
  options?: FormatOptions,
): string {
  return new Intl.NumberFormat(LOCALE_MAP[countryId], {
    style: 'currency',
    currency: CURRENCY_MAP[countryId],
    minimumFractionDigits: options?.decimals ?? 0,
    maximumFractionDigits: options?.decimals ?? 0,
    notation: options?.compact ? 'compact' : 'standard',
  }).format(value);
}

/**
 * Format a fraction as a percentage using Intl.NumberFormat.
 */
export function formatPercentLocale(
  value: number,
  countryId: CountryId,
  options?: FormatOptions,
): string {
  return new Intl.NumberFormat(LOCALE_MAP[countryId], {
    style: 'percent',
    minimumFractionDigits: options?.decimals ?? 0,
    maximumFractionDigits: options?.decimals ?? 1,
  }).format(value);
}

// --- Abbreviated formatters ---

const ABBREV_THRESHOLDS: [number, string][] = [
  [1e12, 'tn'],
  [1e9, 'bn'],
  [1e6, 'm'],
  [1e3, 'k'],
];

/**
 * Format a currency value with abbreviation: "$1.2bn", "£3.5m"
 */
export function formatCurrencyAbbr(
  value: number,
  countryId: CountryId,
  options?: { decimals?: number },
): string {
  const sign = value < 0 ? '-' : '';
  const abs = Math.abs(value);
  const sym = SYMBOL_MAP[countryId];
  const decimals = options?.decimals ?? 1;

  for (const [threshold, suffix] of ABBREV_THRESHOLDS) {
    if (abs >= threshold) {
      return `${sign}${sym}${(abs / threshold).toFixed(decimals)}${suffix}`;
    }
  }
  return `${sign}${sym}${abs.toFixed(0)}`;
}

/**
 * Format a number with abbreviation: "1.2bn", "3.5m"
 */
export function formatNumberAbbr(
  value: number,
  _countryId?: CountryId,
  options?: { decimals?: number },
): string {
  const sign = value < 0 ? '-' : '';
  const abs = Math.abs(value);
  const decimals = options?.decimals ?? 1;

  for (const [threshold, suffix] of ABBREV_THRESHOLDS) {
    if (abs >= threshold) {
      return `${sign}${(abs / threshold).toFixed(decimals)}${suffix}`;
    }
  }
  return `${sign}${abs.toFixed(0)}`;
}

// --- Signed percent ---

/**
 * Format a fraction as a signed percentage: "+2.3%" / "-1.5%"
 */
export function formatSignedPercent(
  value: number,
  decimals: number = 1,
): string {
  const pct = (value * 100).toFixed(decimals);
  return value > 0 ? `+${pct}%` : `${pct}%`;
}

// --- Ordinal ---

/**
 * Return the ordinal form: 1 → "1st", 2 → "2nd", 3 → "3rd", 11 → "11th"
 */
export function ordinal(n: number): string {
  const abs = Math.abs(n);
  const mod100 = abs % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${n}th`;
  const mod10 = abs % 10;
  if (mod10 === 1) return `${n}st`;
  if (mod10 === 2) return `${n}nd`;
  if (mod10 === 3) return `${n}rd`;
  return `${n}th`;
}

// --- Precision detection ---

/**
 * Auto-detect the number of decimal places needed for an array of values.
 * Useful for choosing tick formatter precision.
 */
export function precision(
  values: number[],
  multiplier: number = 1,
): number {
  let maxDecimals = 0;
  for (const v of values) {
    const scaled = v * multiplier;
    const str = scaled.toString();
    const dotIndex = str.indexOf('.');
    if (dotIndex >= 0) {
      maxDecimals = Math.max(maxDecimals, str.length - dotIndex - 1);
    }
  }
  return Math.min(maxDecimals, 6);
}

// --- Format powers ---

/**
 * Split a value into [coefficient, suffix] for display.
 * e.g. 2_300_000_000 → [2.3, " billion"]
 */
export function formatPowers(value: number): [number, string] {
  const abs = Math.abs(value);
  if (abs >= 1e12) return [value / 1e12, ' trillion'];
  if (abs >= 1e9) return [value / 1e9, ' billion'];
  if (abs >= 1e6) return [value / 1e6, ' million'];
  if (abs >= 1e3) return [value / 1e3, ' thousand'];
  return [value, ''];
}

// --- Parameter value formatter ---

export interface ParameterFormatOptions {
  countryId?: CountryId;
  fractionDigits?: number;
}

/**
 * Universal formatter for parameter values based on unit type.
 * Handles currency-USD, currency-GBP, /1 (fraction), bool, and plain numbers.
 */
export function formatParameterValue(
  value: unknown,
  unit: string,
  options?: ParameterFormatOptions,
): string {
  if (unit === 'bool' || unit === 'abolition') {
    return value ? 'True' : 'False';
  }

  const num = Number(value);
  if (isNaN(num)) return String(value);

  if (unit === '/1') {
    return `${(num * 100).toFixed(options?.fractionDigits ?? 1)}%`;
  }

  if (unit.startsWith('currency-')) {
    const currCode = unit.slice('currency-'.length).toUpperCase();
    const country = (Object.entries(CURRENCY_MAP).find(
      ([, c]) => c === currCode,
    )?.[0] ?? 'us') as CountryId;
    return formatCurrencyLocale(num, country, {
      decimals: options?.fractionDigits ?? 0,
    });
  }

  return num.toLocaleString(undefined, {
    maximumFractionDigits: options?.fractionDigits ?? 2,
  });
}

// --- Recharts tick formatters ---

/**
 * Create a Recharts tick formatter for a given unit.
 */
export function getRechartsTickFormatter(
  unit: string,
  options?: { countryId?: CountryId; decimals?: number },
): (value: number) => string {
  const countryId = options?.countryId ?? 'us';

  if (unit === '/1' || unit === 'percent') {
    return (v: number) => formatPercent(v, options?.decimals ?? 0);
  }

  if (unit.startsWith('currency')) {
    return (v: number) => formatCurrencyAbbr(v, countryId, { decimals: options?.decimals ?? 0 });
  }

  return (v: number) => formatNumber(v);
}

/**
 * Recharts-compatible percent tick formatter.
 */
export function rechartsPercentFormatter(
  decimalPlaces: number = 0,
  signed: boolean = false,
): (value: number) => string {
  return (value: number) =>
    signed ? formatSignedPercent(value, decimalPlaces) : formatPercent(value, decimalPlaces);
}
