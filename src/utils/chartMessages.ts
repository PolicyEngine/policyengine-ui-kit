import type { CountryId } from '../types/country';
import { formatCurrencyAbbr, formatSignedPercent } from './formatters';

// --- Word wrap (no external dependency) ---

/**
 * Wrap text to a given character width, respecting word boundaries.
 */
export function wordWrap(text: string, width: number = 60): string {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    if (currentLine.length === 0) {
      currentLine = word;
    } else if (currentLine.length + 1 + word.length <= width) {
      currentLine += ' ' + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine.length > 0) {
    lines.push(currentLine);
  }
  return lines.join('\n');
}

// --- Change messages ---

type ChangeDirection = 'increase' | 'decrease' | 'no change';

function getDirection(change: number, tolerance: number): ChangeDirection {
  if (Math.abs(change) <= tolerance) return 'no change';
  return change > 0 ? 'increase' : 'decrease';
}

/**
 * Generate a human-readable message for an absolute change.
 *
 * Example: "This reform would increase income tax revenue by $1.2bn"
 */
export function absoluteChangeMessage(
  subject: string,
  object: string,
  change: number,
  tolerance: number = 0.001,
  formatter?: (value: number) => string,
): string {
  const direction = getDirection(change, tolerance);

  if (direction === 'no change') {
    return `This ${subject} would have no effect on ${object}`;
  }

  const formatted = formatter
    ? formatter(Math.abs(change))
    : Math.abs(change).toLocaleString();

  return `This ${subject} would ${direction} ${object} by ${formatted}`;
}

export interface RelativeChangeOptions {
  decimals?: number;
  formatter?: (value: number) => string;
}

/**
 * Generate a human-readable message for a relative (percentage) change.
 *
 * Example: "This reform would increase the poverty rate by 2.3%"
 */
export function relativeChangeMessage(
  subject: string,
  object: string,
  change: number,
  tolerance: number = 0.001,
  options?: RelativeChangeOptions,
): string {
  const direction = getDirection(change, tolerance);

  if (direction === 'no change') {
    return `This ${subject} would have no effect on ${object}`;
  }

  // Use custom formatter, or fall back to signed percent
  let formatted: string;
  if (options?.formatter) {
    formatted = options.formatter(Math.abs(change));
  } else {
    formatted = formatSignedPercent(
      Math.abs(change),
      options?.decimals ?? 1,
    ).replace('+', '');
  }

  return `This ${subject} would ${direction} ${object} by ${formatted}`;
}

/**
 * Generate a budget impact message using currency abbreviation.
 *
 * Example: "This reform would increase tax revenue by $1.2bn"
 */
export function budgetChangeMessage(
  subject: string,
  object: string,
  change: number,
  countryId: CountryId = 'us',
  tolerance: number = 0.001,
): string {
  return absoluteChangeMessage(subject, object, change, tolerance, (v) =>
    formatCurrencyAbbr(v, countryId, { decimals: 1 }),
  );
}
